

import startServer, {
  CmsModule,
  paginationMiddleware,
} from "./server";



const cmsModule = new CmsModule({
});

const resolvers = cmsModule.getResolvers();


const middlewares = [

  /**
   * Временный хак для перехода на новую призму. 
   * В процессе надо будет от этого уйти к нативным запросам.
   */
  paginationMiddleware,

];


startServer({
  typeDefs: 'src/schema/generated/api.graphql',
  resolvers,
  middlewares,
  contextOptions: {
    resolvers,
  },
});

