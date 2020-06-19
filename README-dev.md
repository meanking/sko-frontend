# VSCode ESLint and Prettier

1. Install ESLint plugin
2. Add this lines to vscode settings:
``` "eslint.packageManager": "yarn",
    "editor.formatOnSave": true,
    "[javascript]": {
        "editor.formatOnSave": false,
    },
    "eslint.autoFixOnSave": true,
    "eslint.alwaysShowStatus": true,
```
3. run `yarn install` (to install eslint dev-dependencies to local `node_modules`)

# References
1. https://eslint.org/docs/user-guide/getting-started
2. https://www.youtube.com/watch?v=YIvjKId9m2c
3. https://github.com/wesbos/dotfiles

# Spacemacs

1. Enable the `react` layer
2. Create a local options file `.dir-locals.el` (file is ignored by git) to
   point to the `eslint` executable inside `node_modules`:

```
((nil . ((flycheck-javascript-eslint-executable . "./node_modules/.bin/eslint"))))
```
