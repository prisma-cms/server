
import expect from "expect";

import chalk from "chalk";
 

import {
  CmsModule,
} from "../../server"


describe("Main Module", () => {

  const cmsModule = new CmsModule();

  it("Get schema", () => {

    const schema = cmsModule.getSchema();

    // console.log(chalk.green("schema"), schema);

    expect(schema).toContain("type Route");
    expect(schema).toContain("type File");
    expect(schema).toContain("enum LetterStatus");
    expect(schema).toContain("type Letter");
    expect(schema).toContain("type Log");
    expect(schema).toContain("enum LogLevel");
    expect(schema).toContain("type User");
    expect(schema).toContain("type UserGroup");
    expect(schema).toContain("type LogedIn");

  })

  it("Get API schema", () => {

    const schema = cmsModule.getApiSchema();

    expect(schema).toContain("type Query");
    expect(schema).toContain("type Mutation");
    expect(schema).toContain("scalar Upload");
    expect(schema).toContain("type Error");
    expect(schema).toContain("type User");
    expect(schema).toContain("type UserResponse");
    expect(schema).toContain("type AuthPayload");

  })

})