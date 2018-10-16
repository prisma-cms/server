// import {CmsModule} from "./server";

// const cwd = process.cwd();

// require("babel-register")({
//   ignore: function (filename) {

//     const relativePath = filename.replace(cwd, "");

//     return /^\/node_modules\//.test(relativePath);
//   },
// });


// const cwd = process.cwd();

require('@babel/register')({
  extensions: ['.js'],
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "transform-es2015-modules-commonjs",
    "@babel/plugin-proposal-class-properties"
  ],

  // ignore: [function (filename) {

  //   return filename.indexOf(cwd + `/node_modules/`) === 0;
  // }],
});

require("@babel/polyfill");


const CmsModule = require("./server").CmsModule;
const cmsModule = new CmsModule({
});
const resolvers = cmsModule.getResolvers();


switch (process.env.action) {

  case "build-schema":

    require("./schema").default(process.env.schemaType);

    break;

  case "start-server":


    const startServer = require("./server").default;

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
  
//       require("./schema")(schemaType);
  
//       break;
  
//     case "start-server":
  
  
//       require("./server");
  
//       break;
  
//     default: throw (new Error("action env not defined"))
  
//   }

// }

// export {
//   CmsModule,
// }


