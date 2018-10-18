


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


const deploy = async function () {


  const {
    endpoint,
  } = process.env;

  if (!endpoint) {
    throw new Error("Environment endpoint required");
  }

  // Deploy prisma schema
  await deploySchema()
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
  await buildApiSchema();
  // console.log("buildApiSchema OK");

}


module.exports = {
  deploySchema,
  getSchema,
  buildApiSchema,
  deploy,
}