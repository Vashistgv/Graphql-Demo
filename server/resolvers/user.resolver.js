import { users } from "../dunmmyData/data.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const userResolver = {
  Mutation: {
    singup: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }

        const existingUser = await User.findOne(username);

        if (existingUser) {
          throw new Error("User already exists");
        }
        const salt = await bcrypt.salt(10);

        const hashedPassword = bcrypt.hash(password, salt);

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
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password)
          throw new Error("Please Enter UserDetails ");
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });
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
      }
    },
  },

  Query: {
    users: () => users,
    user: (_, { userId }) => {
      return users.find((user) => user._id === userId);
    },
  },
  Mutation: {},
};

export default userResolver;
