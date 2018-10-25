

import { generateSchema } from "../../schema";

import {
  buildApiSchema,
} from "./";

// console.log("generateSchema", generateSchema);
// console.log("buildApiSchema", buildApiSchema);

buildApiSchema(generateSchema);
