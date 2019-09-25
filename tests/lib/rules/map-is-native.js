const rule = require("../../../lib/rules/map-is-native");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

const invalidCode = "const testArray = new Array(3);" +
  "const result = _.map(testArray, (props) => {return props});" +
  "const lastArr = [];";

const varObj = 'const testObj = {a: 1};' +
  '_.map(testObj, (prop) => prop)';
const objectCheck = '_.map({a: 1}, (prop) => prop)';

  //todo проверка на переопределение
  // "const _ = {map: function(){}};" +
  // " _.map()";

ruleTester.run("map-is-native", rule, {
  valid: [
    {
      code: 'const variable = collection.map(fn)'
    },
    {
      code: objectCheck
    },
    {
      code: varObj
    }
  ],
  invalid: [
    {
      code: 'const variable = _.map(collection, fn)',
      output: 'const variable = Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn)',
      errors: [
        {
          messageId: "preferNativeMap"
        }
      ]
    },
    {
      code: invalidCode,
      errors: [
        {
          messageId: "preferNativeMap"
        }
      ]
    }
  ]
});
