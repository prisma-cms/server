

export default function ({
  message = 'Ведутся технический работы'
}) {
  return function (resolver, source, args, ctx, info) {
    if (!source) {
      const {
        operation: {
          operation: operationType
        }
      } = info

      if (operationType === 'mutation') {
        throw new Error(message)
      }
    }

    return resolver(source, args, ctx, info)
  }
}
