
import fs from "fs";

import chalk from "chalk";

import PrismaModule from "@prisma-cms/prisma-module";

import MergeSchema from 'merge-graphql-schemas';


import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;

class CmsModule extends PrismaModule {


  constructor(options = {}) {


    super(options);

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


  getApiSchema(types = []) {


    let baseSchema = [];

    let schemaFile = "src/schema/generated/prisma.graphql";

    if (fs.existsSync(schemaFile)) {
      baseSchema = fs.readFileSync(schemaFile, "utf-8");
    }

    let apiSchema = super.getApiSchema(types.concat(baseSchema), []);

    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });


    return apiSchema;

  }


}


export default CmsModule;