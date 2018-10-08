import CmsModule from "./modules";

// const cwd = process.cwd();

// require("babel-register")({
//   ignore: function (filename) {

//     const relativePath = filename.replace(cwd, "");

//     return /^\/node_modules\//.test(relativePath);
//   },
// });



export default function(options = {}){

  const {
    action,
    schemaType,
  } = options;

  switch (action) {

    case "build-schema":
  
      require("./schema")(schemaType);
  
      break;
  
    case "start-server":
  
  
      require("./server");
  
      break;
  
    default: throw (new Error("action env not defined"))
  
  }

}

export {
  CmsModule,
}


