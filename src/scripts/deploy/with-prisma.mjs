import chalk from "chalk";

// import ora from "ora";

import { generateSchema } from "../../schema";

import {
  deploy,
} from "./";

deploy(generateSchema)
.catch(error => {
  console.error(chalk.red("deploy Error"), error);
});


// const spinner = ora('Deploy schema 2').start();
