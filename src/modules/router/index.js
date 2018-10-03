import PrismaModule from "@prisma-cms/prisma-module";


import { fileLoader, mergeTypes } from 'merge-graphql-schemas';



const routes = async function(source, args, ctx, info){

  return ctx.db.query.routes({}, info);
}


const createRoute = async function(source, args, ctx, info){

  return ctx.db.mutation.createRoute({}, info);
}

export default class RouterModule extends PrismaModule {


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


  // getApiSchema(types = []) {


  //   let apiSchema = super.getApiSchema([]);


  //   let schema = fileLoader(__dirname + '/schema/api/', {
  //     recursive: true,
  //   });

  //   apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });


  //   return apiSchema;

  // }


  getResolvers() {


    const resolvers = super.getResolvers();


    Object.assign(resolvers.Query, {
      routes,
    });


    Object.assign(resolvers.Mutation, {
      createRoute,
    });


    Object.assign(resolvers, {
    });


    return resolvers;
  }


}

