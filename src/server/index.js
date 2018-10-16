

import Mailer from "../plugins/Mailer";
import sendmailServer from "sendmail";
import CmsModule from "../modules";
import ImageThumbMiddleware from "../middleware/ImageThumb";
import { GraphQLServer } from "graphql-yoga";
import Context from "@prisma-cms/prisma-context";

const cmsModule = new CmsModule({

});

const resolvers = cmsModule.getResolvers();

const endpoint = process.env.endpoint;


export const startServer = function (options = {}) {


  let {
    sendmailOptions,
    knexOptions,
    contextOptions,
    imagesMiddleware = ImageThumbMiddleware,
    Mailer: MailerPlugin,
    MailerProps,

    ...serverOptions
  } = options;


  if (MailerPlugin === undefined) {
    MailerPlugin = Mailer;
  }


  let sendmailOptionsDefault = {
    logger: {
      debug: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    },
    silent: true,
    // dkim: { // Default: False
    //   privateKey: fs.readFileSync(__dirname + '/dkim-private.pem', 'utf8'),
    //   keySelector: ''
    // },
  }


  if (process.env.SendmailTest === "true") {
    Object.assign(sendmailOptionsDefault, {
      silent: false,
      devPort: 1025, // Default: False
      devHost: 'localhost', // Default: localhost
      smtpPort: 2525, // Default: 25
      smtpHost: 'localhost' // Default: -1 - extra smtp host after resolveMX
    });
  }


  sendmailOptions = {
    ...sendmailOptionsDefault,
    ...sendmailOptions,
  }

  const sendmail = sendmailServer(sendmailOptions);


  knexOptions = {
    client: 'mysql',
    connection: {
      host: 'mysql.prisma',
      user: 'root',
      database: 'prisma@dev',
      password: 'prisma',
    },
    ...knexOptions,
  }

  const knex = require("knex")(knexOptions);


  contextOptions = {
    endpoint,
    secret: 'mysecret123',
    debug: false,
    APP_SECRET: process.env.APP_SECRET,
    knex,
    sendmail,
    MailerProps,
    ...contextOptions,
  }

  const context = new Context(contextOptions);


  let server = new GraphQLServer({
    typeDefs: 'src/schema/generated/api.graphql',
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context,
    resolvers,
    ...serverOptions,
  })


  if (imagesMiddleware) {
    server.use('/images/:type/**', imagesMiddleware)
  }

  server
    // .start(() => console.log('Server is running on http://localhost:4000'))
    .start(async () => {

      const ctx = await context();


      if (process.env.Sendmail === "true" && MailerPlugin) {

        try {
          new MailerPlugin({
            ctx,
          }).start();
        }
        catch (error) {
          console.error(error);
        }

      }


      console.log(`Server is running on http://${process.env.HOST || "localhost"}:${process.env.PORT || 4000}`);

    })

  return server;
}


export {
  CmsModule,
}

export default startServer;