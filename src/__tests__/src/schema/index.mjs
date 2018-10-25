
import expect from "expect";

import chalk from "chalk";
 

import generateSchema from "../../../schema";

import * as fragments from "../../../schema/generated/api.fragments.js";

describe("Main Module", () => {


  it("Generage prisma schema", () => {

    expect(typeof generateSchema === "function").toBe(true);

  })


  // it("Generage prisma schema", () => {

  //   const schema = generateSchema("prisma");

  //   console.log(chalk.green("schema"), schema);

  // })


  // it("Generage API schema", () => {

  //   const schema = generateSchema("api");

  //   console.log(chalk.green("schema"), schema);

  // })


  it("Check API fragments", () => {
 

    const requiredFragments = [
      "RouteFragment",
      "UserFragment",
      "LogFragment",
      "FileFragment",
      "LetterFragment",
      "ErrorFragment",
    ];

    requiredFragments.map(name => {
      const fragment = fragments[name];
      expect(fragment).toContain("fragment");
    });
    
    const {
      UserNoNestingFragment,
    } = fragments;

    expect(UserNoNestingFragment).toNotContain("LogedIns");

  })


})