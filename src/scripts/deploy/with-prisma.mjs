
import { generateSchema } from "../../schema";

import {
  deploy,
} from "./";

// console.log("deploy", deploy);
// console.log("generateSchema", generateSchema);
// console.log("generateSchema()", generateSchema("prisma"));

deploy(generateSchema);
