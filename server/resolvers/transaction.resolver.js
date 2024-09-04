import { users } from "../dunmmyData/data.js";

const transactionResolver = {
  Query: {
    users: () => users,
  },
  Mutation: {},
};

export default transactionResolver;
