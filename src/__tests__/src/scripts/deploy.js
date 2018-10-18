
import expect from "expect";

const chalk = require("chalk");

const {
  deploySchema,
  getSchema,
  buildApiSchema,
} = require("../../../scripts/deploy/handlers");


describe("Deploy scripts", () => {


  it("Deploy schema", () => {

    // const schema = generateSchema("prisma");

    // console.log(chalk.green("schema"), schema);

    const {
      endpoint,
    } = process.env;


    if (endpoint) {

      return new Promise((resolve) => {

        jest.useFakeTimers();

        deploySchemaTest();

        setTimeout(async () => {

          resolve();

        }, 5000);

        jest.runAllTimers();

      });

    }
    else {

      console.log(chalk.yellow("Env endpoint does not provided. Skip deploy schema"));
      return;
    }


  })


})


const deploySchemaTest = async function(){

  await deploySchema();

}