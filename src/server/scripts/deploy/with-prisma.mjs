import chalk from "chalk";

import {
  deploy,
} from "./";

import { generateSchema } from "./schema"


try {
  deploy(generateSchema)
}
catch (error) {
  console.error(chalk.red("Deploy prisma Error"), error);
};

