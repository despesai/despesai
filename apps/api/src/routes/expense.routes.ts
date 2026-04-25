import { Router } from 'express'
import { TransactionService } from '../services/transaction.service'
import { requireAuth } from '../middleware/require-auth.middleware'

const router = Router()
const service = new TransactionService()

router.use(requireAuth)

router.post('/', async (req, res, next) => {
  try {
    const data = { ...req.body, type: 'EXPENSE' }
    const result = await service.createTransaction(req.user!.id, data)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const results = await service.listTransactions(req.user!.id, 'EXPENSE')
    res.json(results)
  } catch (error) {
    next(error)
  }
})

export { router as expenseRoutes }
