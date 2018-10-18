

// const basepath = process.cwd();

// require('@babel/polyfill');

// require('@babel/register')({
//   extensions: ['.js'],
//   // presets: ['react', "es2015"],
//   // presets: ["es2015"],
//   // presets: ['react'],
//   // presets: [ "es2015", "react", "stage-0"],
//   "presets": [
//     "@babel/preset-env",
//     // "@babel/preset-react"
//   ],
//   "plugins": [
//     // "transform-ensure-ignore"
//     "transform-es2015-modules-commonjs",
//     "@babel/plugin-proposal-class-properties"
//   ],
//   // ignore: /\/prisma\/node_modules\//,

//   ignore: [function (filename) {
//     // console.log(filename.indexOf(basepath + `/node_modules/`));

//     return filename.indexOf(basepath + `/node_modules/`) === 0;
//   }],

//   // ignore: function(filename) {
//   //   // console.log('filename', filename);
//   //   // if (filename === "/path/to/es6-file.js") {
//   //   if (filename === "/path/to/es6-file.js") {
//   //     return false;
//   //   } else {
//   //     return true;
//   //   }
//   //   return true;
//   // },
// });

import expect from "expect";

const chalk = require("chalk");

const {
  CmsModule,
  startServer,
  default: defaultStartServer,
} = require("../server");


describe("Server", () => {

  it("Load server class", () => {


    expect(startServer).toNotBe(null);
    expect(CmsModule).toNotBe(null);
    expect(startServer === defaultStartServer).toBe(true);

  })

})