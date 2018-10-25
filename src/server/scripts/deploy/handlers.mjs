
import ora from "ora";

import chalk from "chalk";

import PrismaEngine from "prisma-cli-engine";


import GenerateFragmentsHandler from "graphql-cli-generate-fragments/dist/GenerateFragments";

import PrismaYml from 'prisma-yml'


// import prismaDeploy from "prisma-cli-core/dist/commands/deploy/deploy";
import PrismaCliCore from "prisma-cli-core";

import GetSchema from "graphql-cli/dist/cmds/get-schema";

const {
  PrismaDefinitionClass,
} = PrismaYml;

const {
  handler,
} = GetSchema;

const {
  Config,
} = PrismaEngine

const {
  GenerateFragments,
} = GenerateFragmentsHandler;

const {
  Deploy: prismaDeploy,
} = PrismaCliCore;


class CustomGenerateFragments extends GenerateFragments {

  getProjectConfig() {

    return {
      app: {
        config: {
          "extensions": {
            "prepare-bundle": {
              "output": "src/schema/generated/api.graphql"
            },
            "generate-fragments": {
              "generator": "js",
              "output": "src/schema/generated/api.fragments.js"
            },
          },
        },
      },
    }
  }

  async fragments() {

    let result;

    try {

      result = await super.fragments()
    }
    catch (error) {
      this.context.spinner.fail(error.message);
    }

    return result;

  }


}

const generator = new CustomGenerateFragments({
  spinner: ora('Generate fragments'),
  getConfig: (props) => {


    return {
      getProjectConfig: (props) => {

      },
    };
  },
}, {
    project: "app",
    // generator: "js",
  });





const buildApiSchema = async function (generateSchema) {


  /**
   * Build api schema
   */

  const apiSchema = generateSchema("api");


  const fragments = await generator.handle()
    .catch(error => {
      console.error("Error", error);
    });


}




const deploySchema = function (generateSchema) {

  return new Promise(async (resolve, reject) => {


    let schema;

    try {
      schema = generateSchema("prisma");
    }
    catch (error) {
      console.error(chalk.red("deploySchema error"), error);
      reject(error);
    }

    if (!schema) {
      return reject(new Error("Schema is empty"));
    }


    class CustomPrismaDefinitionClass extends PrismaDefinitionClass {


      async load(args, envPath) {


        let {
          envVars,
          ...other
        } = this;

        const {
          endpoint,
        } = envVars;

        this.definition = {
          endpoint,
          datamodel: true,
        }

        this.typesString = schema;


        return;
      }

    }


    class Deploy extends prismaDeploy {

      constructor(options) {

        super(options);



        this.definition = new CustomPrismaDefinitionClass(
          this.env,
          this.config.definitionPath,
          process.env,
          this.out,
        )

      }

      // const spinner = ora('Deploy schema');

      async run(props, args) {

        const spinner = ora('Deploy schema').start();


        try {
          const promise = super.run(props);


          const result = await promise
            .catch(error => {
              spinner.fail(error.message);
            });

          const {
            stderr,
            stdout,
          } = this.out;



          if (stdout.output) {
            spinner.succeed(stdout.output);
          }

          resolve(result);

          return result;
        }
        catch (error) {
          console.error(chalk.red("Error"), error);
          reject(error);
        }

      }


    }



    let argv = process.argv && process.argv.map(n => n) || [];

    const force = argv && argv.indexOf("--force") !== -1 || false;
    
    try {
      const HandlerObject = await Deploy.mock(force ? "-f" : "")
        .then(handler => {

          return handler;
        })
        .catch(error => {

          console.error(chalk.red("Error 2"), error);
        });

        console.log("HandlerObject.flags", HandlerObject.flags);

    }
    catch (error) {
      console.error(chalk.red("Error 2"), error);
    }

  });


}


const getSchema = async function () {



  const result = await handler({
    spinner: ora('Get schema'),
  }, {
      endpoint: process.env.endpoint,
      output: "src/schema/generated/prisma.graphql",
    })
    .catch(error => {
      console.error(chalk.red("Get schema"), error);
    });

  return result;
}

export {
  buildApiSchema,
  deploySchema,
  getSchema,
}
