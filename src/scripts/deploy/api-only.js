
const { 
  buildApiSchema,
} = require("./");


const {
  endpoint,
} = process.env;

if(!endpoint){
  throw new Error("Environment endpoint required");
}

const deploy = async function () {

  // build API schema
  await buildApiSchema();

}

deploy();
