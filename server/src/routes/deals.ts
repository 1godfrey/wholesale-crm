import express from 'express';
import { dealsController } from '../controllers/deals';

export const dealsRouter = express.Router();

dealsRouter.get('/', dealsController.getDeals);
// dealsRouter.get('/:id', dealsController.getDealById);
dealsRouter.post('/', dealsController.createDeal);
// dealsRouter.patch('/:id', dealsController.updateDeal);
dealsRouter.post('/:id/status', dealsController.updateDealStatus);
// dealsRouter.get('/:id/history', dealsController.getDealStatusHistory);
// dealsRouter.get('/:id/documents', dealsController.getDealDocuments);
dealsRouter.post('/:id/documents', dealsController.createDealDocument);