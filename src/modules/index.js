
import fs from "fs";

import chalk from "chalk";

import PrismaModule from "@prisma-cms/prisma-module";

import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

import { parse } from "graphql";

import UsersModule from "./user";
import FilesModule from "./Files";
import RouterModule from "./router";


class CoreModule extends PrismaModule {



  constructor(options = {}) {

    let {
      modules = [],
    } = options;

    modules = modules.concat([
      UsersModule,
      FilesModule,
      RouterModule,
    ]);

    Object.assign(options, {
      modules,
    });

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


    let baseSchema = fs.readFileSync("src/schema/generated/prisma.graphql", "utf-8");

    



    // let apiSchema = super.getApiSchema(types.concat(baseSchema), ["UserCreateInput"]);
    let apiSchema = super.getApiSchema(types.concat(baseSchema), []);

    // if (schema) {
    //   types = types.concat(schema);
    // }

    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });


    return apiSchema;

  }


}


export default CoreModule;