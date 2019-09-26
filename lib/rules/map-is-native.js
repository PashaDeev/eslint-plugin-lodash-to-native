module.exports = {
  meta: {
    type: 'suggestion',
    docs: 'lodash map function should replace to native Array.map',
    messages: {
      preferNativeMap: 'you should replace lodash map method to native array.map',
    },
    fixable: 'code',
  },

  create(context) {
    const LODASH_NAME = '_';
    const MAP_NAME = 'map';
    const ARRAY_EXPRESSION = 'ArrayExpression';
    const NEW_EXPRESSION = 'NewExpression';
    const ARRAY_NAME = 'Array';
    const OBJECT_EXPRESSION = 'ObjectExpression';

    const getArray = (array, cb) => `${array}.map(${cb})`;

    const getArrayWrapper = (array, cb, source, node) =>
      `Array.isArray(${array}) ? ${getArray(array, cb)} : ${source.getText(node)}`;

    const getType = (scope, node) => {
      const [arg] = node.arguments.slice(0, 1);
      if (arg.type === OBJECT_EXPRESSION || arg.type === ARRAY_EXPRESSION) return arg.type;

      const firstArgumentName = arg.name;

      if (!firstArgumentName) return false;

      const [argument] = scope.variables.filter(item => item && item.name === firstArgumentName);

      if (!argument) return false;

      const { type } = argument.references[0].writeExpr;
      if (type === NEW_EXPRESSION) {
        return argument.references[0].writeExpr.callee.name;
      }
      return type;
    };

    /**
     * Фнкция для фикса
     * @param node
     * @param sourceCode
     * @param isArray
     * @return {Function}
     */
    function fix(node, sourceCode, isArray) {
      const argArray = sourceCode.getText(node.arguments[0]);
      const argCallback = sourceCode.getText(node.arguments[1]);

      return fixer => {
        if (isArray) {
          return fixer.replaceText(node, getArray(argArray, argCallback));
        }
        return fixer.replaceText(node, getArrayWrapper(argArray, argCallback, sourceCode, node));
      };
    }

    /**
     * error message
     * @param node
     * @return {{node: *, messageId: string}}
     */

    return {
      [`CallExpression[callee.object.name="${LODASH_NAME}"][callee.property.name='${MAP_NAME}']`](
        node,
      ) {
        if (node.arguments.length < 2) return;
        const scope = context.getScope();
        const sourceCode = context.getSourceCode();

        const type = getType(scope, node);

        let isArray;

        switch (type) {
          case ARRAY_EXPRESSION:
            isArray = true;
            break;
          case ARRAY_NAME:
            isArray = true;
            break;
          case OBJECT_EXPRESSION:
            return;
          default:
            isArray = false;
        }

        context.report({
          node,
          messageId: 'preferNativeMap',
          fix: fix(node, sourceCode, isArray),
        });
      },
    };
  },
};
