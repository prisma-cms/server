
import fs from "fs";

// import chalk from "chalk";

import PrismaModule from "@prisma-cms/prisma-module";
import MailModule from "@prisma-cms/mail-module";
import LogModule from "@prisma-cms/log-module";

import MergeSchema from 'merge-graphql-schemas';


import path from 'path';

/* eslint-disable */
const moduleURL = new URL(import.meta.url);
/* eslint-enable */

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;

class CmsModule extends PrismaModule {


  constructor(options = {}) {


    super(options);

    this.mergeModules([
      MailModule,
      LogModule,
    ]);

  }



  getSchema(types = []) {


    let schema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });



    if (schema) {
      types = types.concat(schema);
    }


    let typesArray = super.getSchema(types);

    return typesArray;

  }


  getApiSchema(types = [], excludeTypes = []) {


    let baseSchema = [];

    let schemaFile = __dirname + "/../schema/generated/prisma.graphql";

    if (fs.existsSync(schemaFile)) {
      baseSchema = fs.readFileSync(schemaFile, "utf-8");
    }

    let apiSchema = super.getApiSchema(types.concat(baseSchema), excludeTypes);

    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });


    return apiSchema;

  }


}


export default CmsModule;