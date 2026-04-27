import { Router } from 'express';
import { TransactionService } from '../services/transaction.service';
import { requireAuth } from '../middleware/require-auth.middleware';

const router = Router();
const service = new TransactionService();


router.get('/', async (req, res, next) => {
  try {
    const transactions = await service.listTransactions(req.user!.id);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const transaction = await service.getTransaction(req.params.id, req.user!.id);
    res.json(transaction);
  } catch (error) {
    next(error);
  }
});


export { router as transactionRoutes };
