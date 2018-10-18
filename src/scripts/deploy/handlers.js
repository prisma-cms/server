const ora = require('ora');

const chalk = require("chalk");

const {
  Config,
} = require("prisma-cli-engine/dist/Config");

// const { generateSchema } = require("../../schema");


const {
  GenerateFragments,
} = require("graphql-cli-generate-fragments/dist/GenerateFragments");

// console.log("GenerateFragments", GenerateFragments);

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
  
  // processFragments(schemaPath){

  //   schemaPath = "src/schema/generated/api.graphql";
    
  //   let result = super.processFragments(schemaPath);
    
  //   return result;
    
  // }

}

const generator = new CustomGenerateFragments({
  spinner: ora('Generate fragments'),
  getConfig: (props) => {

    // console.log(chalk.green("getConfig props"), props);

    return {
      getProjectConfig: (props) => {

        // console.log(chalk.green("getProjectConfig props"), props);
      },
    };
  },
}, {
    project: "app",
    // generator: "js",
  });



const { Environment, PrismaDefinitionClass } = require('prisma-yml')


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


// const generatePrismaSchema = async function (generateSchema) {
//   /**
//    * Build schema prisma
//    */

//   const schema = await generateSchema("prisma");

//   console.log("schema", schema);


//   return schema;

// }


const deploySchema = async function (generateSchema) {

  const {
    default: prismaDeploy,
  } = require("prisma-cli-core/dist/commands/deploy/deploy");

  const schema = await generateSchema("prisma");

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


      // console.log(chalk.green("Deploy constructor this.config"), this.config);
      // console.log(chalk.green("Deploy constructor this.env"), this.env);

      // console.log(chalk.green("Deploy constructor this.flags"), this.flags);
      // console.log(chalk.green("Deploy constructor this.argv"), this.argv);
      // console.log(chalk.green("Deploy constructor process.argv"), process.argv);
      // console.log(chalk.green("Deploy constructor this.args"), this.args);

      // console.log(chalk.green("Deploy constructor this.args"), process);

      // this.flags = {
      //   force: true,
      // }

      // console.log(chalk.green("Deploy constructor this.flags 2"), this.flags);

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

  // result = await Deploy.mock({
  //   mockConfig,
  // },
  // // ...process.argv,
  //   // '--force',
  //   // "true",
  // )

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

  const {
    handler,
  } = require("graphql-cli/dist/cmds/get-schema");


  const result = await handler({
    spinner: ora('Get schema'),
  }, {
      endpoint: process.env.endpoint,
      output: "src/schema/generated/prisma.graphql",
    });

  return result;
}

module.exports = {
  buildApiSchema,
  deploySchema,
  getSchema,
}
