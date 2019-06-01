

import startServer, {
  CmsModule,
} from "./server";



const cmsModule = new CmsModule({
});

const resolvers = cmsModule.getResolvers();


startServer({
  typeDefs: 'src/schema/generated/api.graphql',
  resolvers,
});

