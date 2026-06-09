import app from "./src/app.js";
import { connectDatabase } from "./src/config/db.js";
import { env } from "./src/config/env.js";

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(
        `Server running in ${env.NODE_ENV} mode on port ${env.PORT}`
      );
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${env.PORT} is already in use. Update PORT in api/.env or stop the process using that port.`
        );
        process.exit(1);
      }

      console.error("Failed to start server:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
