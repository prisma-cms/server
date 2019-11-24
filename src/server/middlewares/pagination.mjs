/**
 * В новой версии призмы Connection-запросы в aggregate::count
 * стали возврящать не общее число всех найденых объектов,
 * а только количество полученных в запросе объектов,
 * что делает такую информацию полностью непригодную для
 * формирования постраничности.
 * Данный middleware выполняет дополнительный запрос для таких, чтобы получить
 * именно количество всех найденных объектов.
 */

const paginationMiddleware = function (resolver, source, args, ctx, info) {
  // console.log('resolve', resolve);

  // return resolve(source, args, ctx, info);

  // console.log('fieldName', fieldName);

  const result = resolver(source, args, ctx, info)

  /**
   * Если это свойства полученного объекта, то не обрабатываем его, нас интересует
   * только корневой запрос
   */
  if (source) {
    return result
  }

  const {
    resolvers
  } = ctx

  const {
    Query = {}
  } = resolvers || {}

  const {
    fieldName,
    operation: {
      operation: operationType
    }
  } = info


  if (operationType !== 'query' || !fieldName.endsWith('Connection') || !Query[fieldName]) {
    return result
  }

  // console.log('info.operation operationType', operationType);

  // console.log('source', source);
  // console.log('Query[fieldName]', Query[fieldName]);
  // console.log('resolver', resolver);

  // console.log('resolve args', JSON.stringify(args, true, 2));

  // else

  // return resolver(source, args, ctx, info)
  return result
    .then(async r => {
      if (r.aggregate) {
        const {
          db
        } = ctx

        const {
          where
        } = args


        // console.log('where', JSON.stringify(where, true, 2));

        const aggregate = await db.query[fieldName]({
          where
        }, `{
          aggregate{
            count
          }
        }`)

        // console.log('aggregate', aggregate);


        Object.assign(r, {
          ...aggregate
        })
      }

      return r
    })
}

export default paginationMiddleware
