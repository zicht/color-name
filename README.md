# Color name

Get the name of a hex color value.

Uses the website [Color name & hue](http://www.color-blindness.com/color-name-hue/).

# Requirements
* node >= 8

# Installation
```bash
git clone git@github.com:zicht/color-name.git
cd color-name
npm install
```

# Usage
The usage requires a hexadecimal argument.

Both uppercase and lowercase letters (if present) are allowed:
```bash
local/path/to/this/repository/bin/color-name fd3aaa
// output: red--wild-strawberry

local/path/to/this/repository/bin/color-name AB12FF
// output: violet--electric-purple
```

## Alias
It is recommended to create an alias, for example in your `~/.bash_aliases`. Afterwards, you can call it more easily from your terminal instead of typing out the full path.

Example: if you installed this repository in `~/code/zicht/`, then an alias command called `zcolor` would be:
```bash
alias zcolor='~/code/zicht/color-name/bin/color-name $1'
```

Executing the command in the terminal will look like this:
```bash
zcolor 461154
// output: violet--persian-indigo
```

# Maintainers
* Virginia Meijer <virginia@zicht.nl>
