// eslint-disable-next-line import/first
import { conf } from "~src/config/settings";
// eslint-disable-next-line import/first
import { createServer } from "~src/svc/server";

const port = conf.PORT;

const startServer = async () => {
  try {
    const server = await createServer();
    server.listen(port, () => {
      console.log(`Running server on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit process if server initialization fails
  }
};

// Call startServer and handle the promise
startServer().catch((error) => {
  console.error("Error during server startup:", error);
  process.exit(1); // Exit process if startServer fails
});
