
export const modifyArgs = function (source, args, ctx, info, modifier) {

  if (arguments.length <= 3) {

    return modifyArgsDeprecated.apply(modifyArgsDeprecated, arguments);

  }

  else {

    let where = args.where;

    if (where && modifier) {

      /**
       * Очищаем все аргументы, иначе вычищаемый параметр будет взят в дальнейшем
       * из объекта info.
       * Делать это надо только один раз
       */

      if (info) {

        info.fieldNodes.map(n => {
          n.arguments = []
        });
      }

      return modifyArgsNew(source, args, ctx, info, modifier, where);

    }

  }

}


const modifyArgsNew = function (source, args, ctx, info, modifier, where) {


  if (typeof where === "object") {

    if (Array.isArray(where)) {

      where.map(n => modifyArgsNew(source, args, ctx, info, modifier, n))

    }
    else {

      modifier(source, args, ctx, info, where);

      /**
       * Проходим по всем остальным элементам условия
       */
      for (var i in where) {
        modifyArgsNew(source, args, ctx, info, modifier, where[i]);
      }

    }

  }


  return where;
}


const modifyArgsDeprecated = function (where, modifier, info) {


  if (where && modifier) {


    /**
     * Очищаем все аргументы, иначе вычищаемый параметр будет взят в дальнейшем
     * из объекта info.
     * Делать это надо только один раз
     */

    if (info) {

      console.error(chalk.red("Deprecated"), "modifyArgs with 3 or less arguments is deprecated. Use `source, args, ctx, info` instead.");

      info.fieldNodes.map(n => {
        n.arguments = []
      });
    }

    if (typeof where === "object") {

      if (Array.isArray(where)) {

        where.map(n => modifyArgsDeprecated(n, modifier))

      }
      else {

        modifier(where);

        /**
         * Проходим по всем остальным элементам условия
         */
        for (var i in where) {
          modifyArgsDeprecated(where[i], modifier);
        }

      }

    }

  }

  return where;
}
