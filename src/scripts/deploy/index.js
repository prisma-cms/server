
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

});

require("@babel/polyfill");


const {
  deploySchema,
  getSchema,
  buildApiSchema,
} = require("./handlers");


// const deploy = async function () {

//   // Deploy prisma schema
//   await deploySchema();

//   // Downdload prisma schema from endpoint
//   await getSchema();

//   // build API schema
//   await buildApiSchema();

// }

// deploy();


module.exports = {
  deploySchema,
  getSchema,
  buildApiSchema,
}