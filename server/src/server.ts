import { createApp } from './app';
import { initDb } from './db';
import { config } from './config';

const startServer = async () => {
  try {
    // Initialize database
    await initDb();

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();