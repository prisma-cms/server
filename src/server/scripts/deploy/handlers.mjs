
import ora from 'ora'

import chalk from 'chalk'

// import PrismaEngine from 'prisma-cli-engine'


import GenerateFragmentsHandler from 'graphql-cli-generate-fragments/dist/GenerateFragments'

import PrismaYml from 'prisma-yml'


// import prismaDeploy from "prisma-cli-core/dist/commands/deploy/deploy";
import PrismaCliCore from 'prisma-cli-core'

import GetSchema from 'graphql-cli/dist/cmds/get-schema'
// import addEndpoint from 'graphql-cli/dist/cmds/add-endpoint'
import GraphqlConfig from 'graphql-config'

const {
  GraphQLEndpoint,
} = GraphqlConfig

const {
  PrismaDefinitionClass,
} = PrismaYml

const {
  handler,
} = GetSchema

// const {
//   Config,
// } = PrismaEngine

const {
  GenerateFragments,
} = GenerateFragmentsHandler

const {
  Deploy: prismaDeploy,
} = PrismaCliCore


// class GetSchemaContext extends GenerateFragments {
//   getProjectConfig() {
//     return {
//       endpointsExtension: {
//         getEndpoint: (url) => {

//           console.log('endpointsExtension url', url);
//           const endpoint = new GraphQLEndpoint({
//             url,
//           });

//           return endpoint;
//         },
//       },
//       app: {
//         config: {
//           extensions: {
//             'prepare-bundle': {
//               output: 'src/schema/generated/api.graphql'
//             },
//             'generate-fragments': {
//               generator: 'js',
//               output: 'src/schema/generated/api.fragments.js'
//             },
//           },
//         },
//       },
//     }
//   }

//   async fragments() {
//     let result

//     try {
//       result = await super.fragments()
//     } catch (error) {
//       this.context.spinner.fail(error.message)
//     }

//     return result
//   }
// }


class CustomGenerateFragments extends GenerateFragments {
  getProjectConfig() {
    return {
      app: {
        config: {
          extensions: {
            'prepare-bundle': {
              output: 'src/schema/generated/api.graphql'
            },
            'generate-fragments': {
              generator: 'js',
              output: 'src/schema/generated/api.fragments.js'
            },
          },
        },
      },
    }
  }

  async fragments() {
    let result

    try {
      result = await super.fragments()
    } catch (error) {
      this.context.spinner.fail(error.message)
    }

    return result
  }
}


class GetSchemaContext extends CustomGenerateFragments {
  getProjectConfig() {
    return {
      ...super.getProjectConfig(),
      endpointsExtension: {
        getEndpoint: (url) => {
          // console.log('endpointsExtension url', url);
          const endpoint = new GraphQLEndpoint({
            url,
          })

          return endpoint
        },
      },
    }
  }

  // async fragments() {
  //   let result

  //   try {
  //     result = await super.fragments()
  //   } catch (error) {
  //     this.context.spinner.fail(error.message)
  //   }

  //   return result
  // }
}



const generator = new CustomGenerateFragments({
  spinner: ora('Generate fragments'),
  getConfig: (props) => {
    return {
      getProjectConfig: (props) => {

      },
    }
  },
}, {
  project: 'app',
  // generator: "js",
})





const buildApiSchema = async function (generateSchema) {
  /**
   * Build api schema
   */

  generateSchema('api')


  await buildApiFragments()
}


const buildApiFragments = async function () {
  await generator.handle()
    .catch(error => {
      console.error('Error', error)
    })
}




const deploySchema = function (generateSchema) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let schema

    try {
      schema = generateSchema('prisma')
    } catch (error) {
      console.error(chalk.red('deploySchema error'), error)
      reject(error)
    }

    if (!schema) {
      return reject(new Error('Schema is empty'))
    }


    class CustomPrismaDefinitionClass extends PrismaDefinitionClass {
      // getClusterName() {

      //   throw new Error ("getClusterName");

      //   const name = super.getClusterName();

      //   console.log(chalk.green('getClusterName name'), data)


      //   return name;
      // }

      async getCluster(throws) {
        const data = await super.getCluster(throws)

        // console.log('getCluster data', data)

        data.name = 'local'
        return data
      }

      async getClusterByEndpoint(data) {
        const cluster = await super.getClusterByEndpoint(data)

        // console.log('getClusterByEndpoint data', data)
        // console.log('getClusterByEndpoint cluster', cluster)

        // cluster.name = 'local'

        return cluster
      }

      async load(args, envPath) {
        const {
          envVars,
          // ...other
        } = this

        const {
          endpoint,
        } = envVars

        this.definition = {
          endpoint,
          datamodel: true,
        }

        this.typesString = schema
      }
    }


    class Deploy extends prismaDeploy {
      constructor(options) {
        super(options)

        this.definition = new CustomPrismaDefinitionClass(
          this.env,
          this.config.definitionPath,
          process.env,
          this.out,
        )
      }

      // const spinner = ora('Deploy schema');
      async run(props, args) {
        const spinner = ora('Deploy schema').start()


        try {
          const promise = super.run(props)


          const result = await promise
            .catch(error => {
              spinner.fail(error.message)
            })

          const {
            // stderr,
            stdout,
          } = this.out



          if (stdout.output) {
            spinner.succeed(stdout.output)
          }

          resolve(result)

          return result
        } catch (error) {
          console.error(chalk.red('Error'), error)
          reject(error)
        }
      }
    }



    const argv = (process.argv && process.argv.map(n => n)) || []

    const force = (argv && argv.indexOf('--force') !== -1) || false

    try {
      await Deploy.mock(force ? '-f' : '')
        .then(handler => {
          return handler
        })
        .catch(error => {
          console.error(chalk.red('Error 2'), error)
        })

      // console.log("HandlerObject.flags", HandlerObject.flags);
    } catch (error) {
      console.error(chalk.red('Error 2'), error)
    }
  })
}


// const getSchema = async function () {
//   const result = await handler({
//     spinner: ora('Get schema'),
//     getConfig: () => {

//       return new CustomGenerateFragments()
//     }
//   }, {
//     endpoint: process.env.endpoint,
//     output: 'src/schema/generated/prisma.graphql',
//   })
//     .catch(error => {
//       console.error(chalk.red('Get schema'), error)
//     })

//   return result
// }

const getSchema = async function () {
  const result = await handler({
    spinner: ora('Get schema'),
    getConfig: () => {
      const context = new GetSchemaContext({
        // spinner: ora('Generate fragments'),
        getConfig: (props) => {
          return {
            getProjectConfig: (props) => {
              // console.log('getProjectConfig', props)
            },
          }
        },
      }, {
        project: 'app',
        // generator: "js",
      })

      return context
      // return new CustomGenerateFragments()
    }
  }, {
    endpoint: process.env.endpoint,
    output: 'src/schema/generated/prisma.graphql',
  })
    .catch(error => {
      console.error(chalk.red('Get schema'), error)
    })

  return result
}

export {
  buildApiSchema,
  deploySchema,
  getSchema,
  buildApiFragments,
}
