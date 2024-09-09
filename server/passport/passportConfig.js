import passport from "passport";
import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configPassowrd = async () => {
  passport.serializeUser((user, done) => {
    console.log("serializeUser", user);
    done(null, user.id); // null bcoz no error
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = User.findById(id);
      done(null, user);
    } catch (error) {
      console.log("Error in deserializeUser", error);
      done(error);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (userName, password, done) => {
      try {
        const user = User.findOne(userName);
        if (!user) {
          throw new Error("Invalid User Name or Password");
        }
        const validatePassword = bcrypt.compare(password, user.password);
        if (!validatePassword) {
          throw new Error("Invalid User Name or Password");
        }

        return done(null, user);
      } catch (error) {
        console.log("error in login ", error);
        return done(error);
      }
    })
  );
};
