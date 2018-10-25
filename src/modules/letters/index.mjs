

import PrismaModule from "@prisma-cms/prisma-module";

// import {resolvers as LettersResolvers} from "@prisma-cms/prisma-uploads";
import PrismaUploads from "@prisma-cms/prisma-uploads";

const {
  resolvers: LettersResolvers
} = PrismaUploads;

// console.log("LettersResolvers", LettersResolvers);

export default class LettersModule extends PrismaModule {


  getResolvers() {

    return {
      Query: {
        letters: (source, args, ctx, info) => {

          return ctx.db.query.letters({}, info);

        },
      },
    };
  }

}



