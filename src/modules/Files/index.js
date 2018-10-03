 

import PrismaModule from "@prisma-cms/prisma-module";
 
import {resolvers as FilesResolvers} from "@prisma-cms/prisma-uploads";

export default class FilesModule extends PrismaModule {
  

  getResolvers() {

    return FilesResolvers;
  }

}



