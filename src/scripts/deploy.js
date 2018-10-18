
require('@babel/register')({
  extensions: ['.js'],
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "transform-es2015-modules-commonjs",
    "@babel/plugin-proposal-class-properties"
  ],

});

require("@babel/polyfill");

const ora = require('ora');

const chalk = require("chalk");


const {
  default: prismaDeploy,
} = require("prisma-cli-core/dist/commands/deploy/deploy");


const {
  default: schemaBuilder,
} = require("../schema");


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
              "output": "src/schema/generated/app.fragments.js"
            },
          },
        },
      },
    }
  }

}

const generator = new CustomGenerateFragments({
  spinner: ora('Generate fragments'),
  getConfig: (props) => {

    console.log(chalk.green("getConfig props"), props);

    return {
      getProjectConfig: (props) => {

        console.log(chalk.green("getProjectConfig props"), props);
      },
    };
  },
}, {
    project: "app",
    // generator: "js",
  });



const { Environment, PrismaDefinitionClass } = require('prisma-yml')


const buildApiSchema = async function () {


  /**
   * Build api schema
   */

  const apiSchema = await schemaBuilder("api");

  // console.log("builded api schema", apiSchema);


  console.log("generator", generator);

  // const fragments = builder.makeFragments(apiSchema);
  const fragments = generator.handle();

  console.log("builded api fragments", fragments);

}


const generateSchema = async function () {
  /**
   * Build schema prisma
   */

  const schema = await schemaBuilder("prisma");


  return schema;

}


const deploySchema = async function () {

  const schema = await generateSchema();

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

  }


  const spinner = ora('Deploy schema').start();

  const result = await Deploy.mock({
  },
  )
    .catch(error => {
      console.error(chalk.red("Error"), error);
    })

  const {
    stderr,
    stdout,
  } = result.out;


  if (stderr.output.toString()) {
    spinner.fail(stderr.output);
  }

  if (stdout.output) {
    spinner.succeed(stdout.output);
  }

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


const deploy = async function () {

  // Deploy prisma schema
  await deploySchema();

  // Downdload prisma schema from endpoint
  await getSchema();

  // build API schema
  await buildApiSchema();

}

deploy();


module.exports = {
  // default: Builder,
  // Builder,
}