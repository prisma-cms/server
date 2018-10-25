
import prismaGenerateSchema from "@prisma-cms/prisma-schema";

import CoreModule from "../modules";

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

// console.log("__dirname", __dirname);

export const generateSchema = function(schemaType){

  return prismaGenerateSchema(schemaType, new CoreModule(), __dirname);
}

export default generateSchema;