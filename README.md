# eslint-plugin-map-replace-plugin

this plugin replace lodash map method to nativ array.map

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-map-replace-plugin`:

```
$ npm install eslint-plugin-map-replace-plugin --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-map-replace-plugin` globally.

## Usage

Add `map-replace-plugin` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "map-replace-plugin"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "map-replace-plugin/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





