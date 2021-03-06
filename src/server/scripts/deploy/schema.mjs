import path from 'path';
import chalk from "chalk";

import prismaGenerateSchema from "@prisma-cms/prisma-schema";

import { CmsModule as CoreModule } from "../../";


export const generateSchema = function (schemaType) {

  let result;

  try {

    /* eslint-disable */
    const moduleURL = new URL(import.meta.url);
    /* eslint-enable */
    
    const basedir = path.join(path.dirname(moduleURL.pathname), "/../../../", "schema/")

    // console.log("basedir", basedir);
    // console.log("CoreModule", CoreModule);
    // console.log("CoreModule", new CoreModule().getSchema());

    result = prismaGenerateSchema(schemaType, new CoreModule(), basedir);
  }
  catch (error) {

    console.error(chalk.red("generateSchema Error"), error);
  }

  return result;

}

export default generateSchema;