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

router.put('/:id', async (req, res, next) => {
  try {
    const result = await service.updateTransaction(
      req.params.id,
      req.user!.id,
      req.body,
      'EXPENSE'
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await service.deleteTransaction(req.params.id, req.user!.id, 'EXPENSE')
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export { router as expenseRoutes }
