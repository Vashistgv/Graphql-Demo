import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import mergeResolver from "./resolvers/index.js";
import mergeTypeDef from "./typeDefs/index.js";
import dotenv from "dotenv";
import { connectDB } from "./MongoDb/connect.js";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";
import { configPassowrd } from "./passport/passportConfig.js";

dotenv.config();

async function startServer() {
  // initialize express
  const app = express();
  // trigger passport to validate user
  configPassowrd();

  // apollo httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  const MongoDBStore = connectMongo(session);

  const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });

  store.on("error", () => console.log("error in mongo session store"));

  app.use(
    session({
      secret: process.env.secretKey,
      resave: false, // this option specifies whether to save the session to the store on every request
      saveUninitialized: false, // option specifies whether to save uninitialized sessions
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true, // this option prevents the Cross-Site Scripting (XSS) attacks
      },
      store: store,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const server = new ApolloServer({
    typeDefs: mergeTypeDef,
    resolvers: mergeResolver,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // app.use(bodyParser.json());
  // app.use(cors());

  await server.start();

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    "/graphql",
    cors({
      origin: "https://localhost:3000/", // to allow front end crosssite url
      credentials: true,
    }),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req, res }) => buildContext({ req, res }), // build context is to auth the req
    })
  );

  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 8000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:8000/graphql`);
  // connect to mongo DB

  await connectDB();
}

startServer();
