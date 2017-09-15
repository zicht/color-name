const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

const INPUT_ELEMENT_SELECTOR = '#cp1_Hex';
const NAME_ELEMENT_SELECTOR = '#cp1_ColorNameText';
const HUE_ELEMENT_SELECTOR = '#cp1_ColorShadeText';
const URL = 'http://www.color-blindness.com/color-name-hue-tool/color-name-hue.html';
const chromeOptions = {
    chromeFlags: [
        '--disable-gpu',
        '--headless',
        '--enable-logging',
        '--no-sandbox'
    ]
};

if (process.argv.length < 3) {
    console.log('Too few arguments.');
    return;
}

if (process.argv.length > 3) {
    console.log('Too many arguments.');
    return;
}

const COLOR = String(process.argv[2]);

if (COLOR.length !== 6) {
    console.log('Invalid color, use hex notation, 6 characters long.')
    return;
}

(async function () {
    async function launchChrome() {
        return await chromeLauncher.launch(chromeOptions);
    }

    const chrome = await launchChrome();
    const protocol = await CDP({
        port: chrome.port
    });

    const {DOM, Page, Emulation, Runtime} = protocol;
    await Promise.all([Page.enable(), Runtime.enable(), DOM.enable()]);

    Page.navigate({
        url: URL
    });

    Page.loadEventFired(async () => {
        const setValue = `
            document.querySelector("${INPUT_ELEMENT_SELECTOR}").value = "${COLOR}";
            document.querySelector("${INPUT_ELEMENT_SELECTOR}").dispatchEvent(new Event("keyup"));
        `;

        await Runtime.evaluate({
            expression: setValue
        });

        const getName = `
            document.querySelector("${NAME_ELEMENT_SELECTOR}").textContent;
        `;

        const getHue = `
            document.querySelector("${HUE_ELEMENT_SELECTOR}").textContent;
        `;

        const nameResult = await Runtime.evaluate({
            expression: getName
        });
        const name = nameResult.result.value.toLowerCase().replace(/\s/g, '-');

        const hueResult = await Runtime.evaluate({
            expression: getHue
        });
        const hue = hueResult.result.value.toLowerCase();

        if (hue === name) {
            console.log(name);
        } else {
            console.log(`${hue}--${name}`);
        }

        protocol.close();
        chrome.kill();
    });
})();
