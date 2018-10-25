
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

// console.log("PrismaDefinitionClass", PrismaDefinitionClass);
// console.log("handler", handler);
// console.log("Config", Config);
// console.log("GenerateFragments", GenerateFragments);
// console.log("prismaDeploy", typeof prismaDeploy, prismaDeploy);
// console.log("Deploy", typeof Deploy, Deploy);

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
      this.context.spinner.fail(error);
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

  const apiSchema = await generateSchema("api");


  // console.log("apiSchema", apiSchema);

  // const fragments = builder.makeFragments(apiSchema);
  const fragments = await generator.handle()
    .catch(error => {
      console.error("Error", error);
    });

  // console.log("builded api fragments", fragments);

}




const deploySchema = async function (generateSchema) {


  const schema = await generateSchema("prisma");

  // console.log("schema", schema);

  // return;

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

    async run(props) {

      const spinner = ora('Deploy schema').start();

      // console.log("this.run this", this);

      let promise

      promise = super.run(props);


      const result = await promise
        .catch(error => {
          spinner.fail(this.out.stderr.output);
          console.error(chalk.red("promise Error"), error);
        });

      const {
        stderr,
        stdout,
      } = this.out;

      // if (stderr.output) {
      //   spinner.fail(stderr.output);
      // }

      if (stdout.output) {
        spinner.succeed(stdout.output);
      }


      return result;

    }


  }



  let result;


  let mockConfig = new Config();

  Object.assign(mockConfig, {
    debug: true,
  });

  let argv = process.argv && process.argv.map(n => n) || [];

  argv.unshift({
    mockConfig,
  });

  // console.log("mock argv", argv);

  result = await Deploy.mock.apply(Deploy, argv)
    .catch(error => {

      console.error(chalk.red("Error 2"), error);
    });

}


const getSchema = async function () {



  const result = await handler({
    spinner: ora('Get schema'),
  }, {
      endpoint: process.env.endpoint,
      output: "src/schema/generated/prisma.graphql",
    });

  return result;
}

export {
  buildApiSchema,
  deploySchema,
  getSchema,
}
