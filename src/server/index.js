

import Mailer from "../plugins/Mailer";



const fs = require("fs");

const { GraphQLServer } = require('graphql-yoga')

const ImageThumbMiddleware = require('../middleware/ImageThumb');

const CoreModule = require("../modules");

const coreModule = new CoreModule({

});

const resolvers = coreModule.getResolvers();

const endpoint = process.env.endpoint;

const Context = require("@prisma-cms/prisma-context");




export default function (options = {}) {


  let {
    sendmailOptions,
    knexOptions,
    contextOptions,
    imagesMiddleware = ImageThumbMiddleware,
    ...serverOptions
  } = options;


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

  const sendmail = require('sendmail')(sendmailOptions);


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


      if (process.env.Sendmail === "true") {

        try {
          new Mailer({
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