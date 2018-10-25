


import {
  deploySchema,
  getSchema,
  buildApiSchema,
} from "./handlers";


const deploy = async function (generateSchema) {


  const {
    endpoint,
  } = process.env;

  if (!endpoint) {
    throw new Error("Environment endpoint required");
  }

  // Deploy prisma schema
  await deploySchema(generateSchema)
    .then(r => {

      // console.log("deploySchema OK");
      return r;
    })
    .catch(error => {

      // console.error("deploySchema Error");
    });

  // Downdload prisma schema from endpoint
  await getSchema();
  // console.log("getSchema OK");

  // build API schema
  await buildApiSchema(generateSchema);
  // console.log("buildApiSchema OK");

}


export {
  deploySchema,
  getSchema,
  buildApiSchema,
  deploy,
}