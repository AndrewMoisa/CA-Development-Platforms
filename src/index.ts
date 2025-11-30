import app from './app';
import { config } from './config/env';
import { checkConnection } from './config/database';

const PORT = config.port;

const startServer = async () => {
  await checkConnection();

  app.listen(PORT, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
};

startServer();
