

import PrismaModule from "@prisma-cms/prisma-module";

// import {resolvers as FilesResolvers} from "@prisma-cms/prisma-uploads";
import PrismaUploads from "@prisma-cms/prisma-uploads";

const {
  resolvers: FilesResolvers
} = PrismaUploads;

// console.log("FilesResolvers", FilesResolvers);

export default class FilesModule extends PrismaModule {


  getResolvers() {

    return FilesResolvers;
  }

}



