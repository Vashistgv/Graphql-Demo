import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDefs from "./user.typeDef.js";
import transactionTypeDef from "./transaction.typeDef.js";

const mergeTypeDef = mergeTypeDefs([userTypeDefs, transactionTypeDef]);

export default mergeTypeDef;
