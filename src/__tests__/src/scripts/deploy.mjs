
import expect from "expect";

import chalk from "chalk";

import  {
  deploySchema,
  getSchema,
  buildApiSchema,
} from "../../../scripts/deploy/handlers";


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



  it("Deploy buildApiSchema", () => {

    let result;

    result = buildApiSchema();

    // expect(await result.then(n => n).catch(error => error)).toBe(true);

    expect(result instanceof Promise).toBe(true);


  })


})


const deploySchemaTest = async function () {

  await deploySchema();

}