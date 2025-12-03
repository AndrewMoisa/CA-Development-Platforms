import app from './app.js';
import { config } from './config/env.js';
import { checkConnection } from './config/database.js';

const PORT = config.port;

const startServer = async () => {
  await checkConnection();

  app.listen(PORT, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
};

startServer();
