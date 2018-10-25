// import {CmsModule} from "./server";

// const cwd = process.cwd();


//   ignore: function (filename) {

//     const relativePath = filename.replace(cwd, "");

//     return /^\/node_modules\//.test(relativePath);
//   },
// });


// const cwd = process.cwd();


//   extensions: ['.js'],
//   "presets": [
//     "@babel/preset-env",
//     "@babel/preset-react"
//   ],
//   "plugins": [
//     "transform-es2015-modules-commonjs",
//     "@babel/plugin-proposal-class-properties"
//   ],

//   // ignore: [function (filename) {

//   //   return filename.indexOf(cwd + `/node_modules/`) === 0;
//   // }],
// });



import startServer, {
  CmsModule,
} from "./server";

import generateSchema from "./schema";

// console.log("startServer", startServer);

// const {
// } = startServer;

const cmsModule = new CmsModule({
});
const resolvers = cmsModule.getResolvers();


switch (process.env.action) {

  case "build-schema":

    generateSchema(process.env.schemaType);

    break;

  case "start-server":


    startServer({
      // typeDefs: 'src/server/schema/generated/api.graphql',
      resolvers,
    });

    break;

  default: throw (new Error("action env not defined"))

}





// export default function(options = {}){

//   const {
//     action,
//     schemaType,
//   } = options;

//   switch (action) {

//     case "build-schema":



//       break;

//     case "start-server":




//       break;

//     default: throw (new Error("action env not defined"))

//   }

// }

// export {
//   CmsModule,
// }


