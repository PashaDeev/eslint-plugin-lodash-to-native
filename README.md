# eslint-plugin-map-replace-plugin

Плагин проверяет возможность использования нативного метода
`Array.map` вместо реализации lodash `_.map()`

## Установка

Установите [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Затем установите [eslint-plugin-lodash-to-native](https://github.com/WD-man/eslint-plugin-lodash-to-native):

```
$ npm install npm i -D https://github.com/WD-man/eslint-plugin-lodash-to-native
```

## Использование

Добавь `map-replace-plugin` в секцию плагинов `.eslintrc` файла конфигурации. префикс `eslint-plugin-` можно опустить:

```json
{
    "plugins": [
        "lodash-to-native"
    ]
}
```


Затем добавь правило в секцию правил

```json
{
    "rules": {
        "lodash-to-native/map-is-native": 2
    }
}
```






