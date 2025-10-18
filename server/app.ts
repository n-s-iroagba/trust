import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './src/middlewares/errorHandler';
import { requestLogger } from './src/middlewares/requestLogger';
import sequelize from './src/models';
import adminWalletRoutes from './src/routers/adminWalletRoutes';
import clientWalletRoutes from './src/routers/clientWalletRoutes';
import transactionRequestRoutes from './src/routers/transactionRequestRoutes';
import transactionRoutes from './src/routers/transactionRoutes';
import logger from './src/services/logger/winstonLogger';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'TrustXWallet API'
  });
});

// API routes
app.use('/api/admin-wallets', adminWalletRoutes);
app.use('/api/client-wallets', clientWalletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/transaction-requests', transactionRequestRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Sync database (use { force: true } only in development to reset database)
    await sequelize.sync({ force: false });
    logger.info('Database synchronized');

    app.listen(PORT, () => {
      logger.info(`TrustXWallet server running on port ${PORT}`);
      console.log(`TrustXWallet API is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;