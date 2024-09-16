import { users } from "../dunmmyData/data.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import Transaction from "../models/transcationModel.js";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        console.log("test singup", username);
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }

        console.log("test singup", username, User);
        const existingUser = await User.findOne({ username });
        console.log("test existingUser", username, existingUser);
        if (existingUser) {
          throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let genderVal = gender === "male" ? "boy" : "girl";

        //https://avatar.iran.liara.run/public  genrate a random avatar
        const profilepic = `https://avatar.iran.liara.run/public/${genderVal}?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: profilepic,
        });

        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (error) {
        console.log("Error in singup ", error);
        throw new Error("Error in singup", error);
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        console.log("username ", username);
        if (!username || !password)
          throw new Error("Please Enter UserDetails ");
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });
        console.log("username user");
        await context.login(user);
        return user;
      } catch (error) {}
    },
    logout: async (_, __, context) => {
      try {
        context.logout();
        await context.req.session.destroy((err) => {
          if (err) throw err;
        });
        context.res.clearCookie("connect.sid");

        return { message: "Logged out successfully" };
      } catch (error) {
        console.log("Error in logout", error);
        throw new Error(err.message || "Internal server error");
      }
    },
  },

  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        console.log("user", user);
        return user;
      } catch (err) {
        console.error("Error in authUser: ", err);
        throw new Error("Internal server error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error in user query:", err);
        throw new Error(err.message || "Error getting user");
      }
    },
  },
  User: {
    transactions: async (parent) => {
      try {
        const transactions = await Transaction.find({ userId: parent._id });
        return transactions;
      } catch (err) {
        console.log("Error in user.transactions resolver: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
};

export default userResolver;
