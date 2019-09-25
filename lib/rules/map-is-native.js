"use strict";

module.exports = {
  meta: {
    type: "suggestion",
    docs: "lodash map function should replace to native Array.map",
    messages: {
      preferNativeMap:
        "you should replace lodash map method to native array.map"
    },
    fixable: "code"
  },
  create(context) {
    const LODASH_NAME = "_";
    const MAP_NAME = "map";
    const ARRAY_EXPRESSION = "ArrayExpression";
    const NEW_EXPRESSION = "NewExpression";
    const ARRAY_NAME = "Array";
    const OBJECT_EXPRESSION = "ObjectExpression";

    const getArray = (array, cb) => {
      return `${array}.map(${cb})`;
    };

    const getArrayWrapper = (array, cb, source, node) => {
      return `Array.isArray(${array}) ? ${getArray(
        array,
        cb
      )} : ${source.getText(node)}`;
    };

    /**
     * Проверка не является ли первый аргумент объектом
     * @param node
     * @return {boolean}
     */
    //fixme проверка на область видимости
    const isObject = node => node.arguments[0].type === OBJECT_EXPRESSION;

    /**
     * Проверяет в локальной области видимости, является ли переменная массивом
     * @param scope
     * @param node
     * @return {boolean}
     */
    const isArray = (scope, node) => {
      let firstArgumentName;
      const [arg] = node.arguments.slice(0, 1);
      firstArgumentName = arg.name;

      if (!firstArgumentName) return false;

      const [argument] = scope.variables.filter(
        item => item && item.name === firstArgumentName
      );

      if (!argument) return false;

      const type = argument.references[0].writeExpr.type;
      switch (type) {
        case ARRAY_EXPRESSION:
          return true;
        case NEW_EXPRESSION:
          return argument.references[0].writeExpr.callee.name === ARRAY_NAME;
        default:
          return false;
      }
    };

    /**
     * Фнкция для фикса
     * @param node
     * @param sourceCode
     * @param isArray
     * @return {Function}
     */
    const fix = function(node, sourceCode, isArray) {
      const argArray = sourceCode.getText(node.arguments[0]);
      const argCallback = sourceCode.getText(node.arguments[1]);

      return fixer => {
        if (isArray) {
          return fixer.replaceText(node, getArray(argArray, argCallback));
        } else {
          return fixer.replaceText(
            node,
            getArrayWrapper(argArray, argCallback, sourceCode, node)
          );
        }
      };
    };

    /**
     * error message
     * @param node
     * @return {{node: *, messageId: string}}
     */

    return {
      [`CallExpression[callee.object.name="${LODASH_NAME}"][callee.property.name='${MAP_NAME}']`](
        node
      ) {
        if (node.arguments.length < 2) return;
        if (isObject(node)) return;
        const scope = context.getScope();
        const sourceCode = context.getSourceCode();

        context.report({
          node,
          messageId: "preferNativeMap",
          fix: fix(node, sourceCode, isArray(scope, node))
        });
      }
    };
  }
};
