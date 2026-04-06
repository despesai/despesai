import { Router } from 'express'
import * as bankService from '../services/bank.service'

const router = Router()

router.post('/', async (req, res, next) => {
  try {
    //para teste sem middleware
    //const userId = 'b9ccd61c-0f20-4731-b9e8-9feaaab4214a'
    const userId = (req as any).user.id
    const result = await bankService.create(userId, req.body)
    res.status(201).json(result)
  } catch (e) {
    next(e)
  }
})

router.get('/', async (req, res, next) => {
  try {
    //para teste sem middleware
    //const userId = 'b9ccd61c-0f20-4731-b9e8-9feaaab4214a'
    const userId = (req as any).user.id
    const result = await bankService.list(userId)
    res.status(200).json(result)
  } catch (e) {
    next(e)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    //para teste sem middleware
    //const userId = 'b9ccd61c-0f20-4731-b9e8-9feaaab4214a'
    const userId = (req as any).user.id
    const bankId = req.params.id
    const result = await bankService.update(userId, bankId, req.body)
    res.status(200).json(result)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    //para teste sem middleware
    //const userId = 'b9ccd61c-0f20-4731-b9e8-9feaaab4214a'
    const userId = (req as any).user.id
    const bankId = req.params.id
    await bankService.remove(userId, bankId)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
})

export default router
