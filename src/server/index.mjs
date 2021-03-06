

import Mailer from '../plugins/Mailer'
// import sendmailServer from "sendmail";
import {
  sendmail as sendmailServer
} from '@prisma-cms/mail-module'
import CmsModule from '../modules'
import graphqlYoga from 'graphql-yoga'
import Context from '@prisma-cms/prisma-context'

import fs from 'fs'

// import Knex from "knex";

import { ImagesMiddleware } from '@prisma-cms/upload-module'
import { modifyArgs } from './helpers/modifyArgs.mjs'
import paginationMiddleware from './middlewares/pagination'
import denyMutationsMiddleware from './middlewares/denyMutations'

const {
  GraphQLServer
} = graphqlYoga


const cmsModule = new CmsModule({

})

const resolvers = cmsModule.getResolvers()

const endpoint = process.env.endpoint


export class PrismaCmsServer {
  constructor(options = {}) {
    this.options = options

    this.startServer = this.startServer.bind(this)
  }


  getOptions() {
    return this.options || {}
  }


  getServer() {
    if (!this.server) {
      const options = this.getOptions()

      let {
        sendmailOptions,
        // knexOptions,
        contextOptions,
        imagesMiddleware,
        // Mailer: MailerPlugin,
        MailerProps,

        ...serverOptions
      } = options


      if (imagesMiddleware === undefined) {
        imagesMiddleware = new ImagesMiddleware().processRequest
      }


      // if (MailerPlugin === undefined) {
      //   MailerPlugin = Mailer;
      // }

      let dkim

      const {
        SendmailDkimFile,
        SendmailDkimKeySelector
      } = process.env

      if (SendmailDkimFile) {
        dkim = {
          privateKey: fs.readFileSync(SendmailDkimFile, 'utf8'),
          keySelector: SendmailDkimKeySelector
        }
      }


      const sendmailOptionsDefault = {
        logger: {
          debug: console.log,
          info: console.info,
          warn: console.warn,
          error: console.error
        },
        silent: true,
        dkim
      }


      if (process.env.SendmailTest === 'true') {
        Object.assign(sendmailOptionsDefault, {
          silent: false,
          devPort: 1025, // Default: False
          devHost: 'localhost', // Default: localhost
          smtpPort: 2525, // Default: 25
          smtpHost: 'localhost' // Default: -1 - extra smtp host after resolveMX
        })
      }


      sendmailOptions = {
        ...sendmailOptionsDefault,
        ...sendmailOptions
      }

      const sendmail = sendmailServer(sendmailOptions)


      // knexOptions = {
      //   client: 'mysql',
      //   connection: {
      //     host: 'mysql.prisma',
      //     user: 'root',
      //     database: 'prisma@dev',
      //     password: 'prisma',
      //   },
      //   ...knexOptions,
      // }

      // const knex = Knex(knexOptions);


      contextOptions = {
        endpoint,
        secret: 'mysecret123',
        debug: false,
        APP_SECRET: process.env.APP_SECRET,
        // knex,
        sendmail,
        MailerProps,
        ...contextOptions
      }

      const {
        processRequest,
        db
      } = new Context(contextOptions)

      this.db = db

      // console.log("context", processRequest);
      // console.log("context db", db);

      this.context = processRequest


      this.server = new GraphQLServer({
        typeDefs: 'src/schema/generated/api.graphql',
        resolverValidationOptions: {
          requireResolversForResolveType: false
        },
        context: request => this.processRequest(request),
        resolvers,
        ...serverOptions
      })


      if (imagesMiddleware) {
        this.server.use('/images/:type/**', imagesMiddleware)
      }
    }

    // return this.server;
    return {
      server: this.server,
      db: this.db
    }
  }


  processRequest(request) {
    return this.context(request)
  }


  startServer(options = {}) {
    const {
      server
    } = this.getServer()

    const {
      bodyParserOptions,
      ...other
    } = options || {}

    server.start({
      bodyParserOptions: {
        ...bodyParserOptions,
        limit: '10mb'
      },
      ...other
    }, () => this.beforeStart())

    return server
  }


  async beforeStart() {
    const ctx = await this.context()

    const options = this.getOptions()

    let {
      Mailer: MailerPlugin

    } = options


    if (MailerPlugin === undefined) {
      MailerPlugin = Mailer
    }


    if (process.env.Sendmail === 'true' && MailerPlugin) {
      try {
        new MailerPlugin({
          ctx
        }).start()
      } catch (error) {
        console.error(error)
      }
    }


    console.log(`Server is running on http://${process.env.HOST || 'localhost'}:${process.env.PORT || 4000}`)
  }
}


export {
  CmsModule,
  modifyArgs,
  paginationMiddleware,
  denyMutationsMiddleware,
}

export const startServer = function (options) {
  return new PrismaCmsServer(options).startServer()
}

export default startServer
