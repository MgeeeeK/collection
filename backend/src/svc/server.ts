import express from "express";
import morgan from "morgan";
import cors from "cors";

import { initializeDataSource } from "~src/config/data-source-initializer";
import { router } from "~src/svc/router";

export const createServer = async () => {
  try {
    await initializeDataSource();
    console.log("All data sources initialized successfully!");
  } catch (err) {
    console.error("Error initializing data sources:", err);
    throw err;
  }

  console.log("Initializing Server");
  const server = express();
  server.use(cors());

  server.use(morgan("combined"));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.use('/api', router);
  return server;
};
