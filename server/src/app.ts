import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import { dealsRouter } from './routes/deals';
import documentsRouter from './routes/documents';
import leadsRouter from './routes/leads';
import usersRouter from './routes/users';
import errorHandler from './middleware/errorHandler';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Routes
  app.use('/api/deals', dealsRouter);
  app.use('/api/documents', documentsRouter);
  app.use('/api/leads', leadsRouter);
  app.use('/api/users', usersRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  // Error handling
  app.use(errorHandler);

  return app;
};