 

import startServer, {
  CmsModule,
} from "./server";
 
 

const cmsModule = new CmsModule({
});

const resolvers = cmsModule.getResolvers();


startServer({
  // typeDefs: 'src/server/schema/generated/api.graphql',
  resolvers,
});

 