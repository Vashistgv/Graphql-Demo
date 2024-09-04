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

dotenv.config();

async function startServer() {
  // initialize express
  const app = express();

  // apollo httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

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
    "/",
    cors(),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  );

  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 8000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:8000/`);
  // connect to mongo DB

  await connectDB();
}

startServer();
