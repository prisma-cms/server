


import {
  deploySchema,
  getSchema,
  buildApiSchema,
  buildApiFragments,
} from './handlers'

import chalk from 'chalk'


const deploy = async function (generateSchema) {
  const {
    endpoint,
  } = process.env

  if (!endpoint) {
    throw new Error('Environment endpoint required')
  }

  // Deploy prisma schema
  return deploySchema(generateSchema)
    .then(async () => {
      // Downdload prisma schema from endpoint
      await getSchema()
        .then(async () => {
          // build API schema
          await buildApiSchema(generateSchema)
          // console.log("buildApiSchema OK");
        })
    })
    .catch(error => {
      console.error(chalk.red('deploySchema Error'), error)
    })
}


export {
  deploySchema,
  getSchema,
  buildApiSchema,
  deploy,
  buildApiFragments,
}
