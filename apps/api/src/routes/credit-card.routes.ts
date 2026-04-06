import { Router } from 'express'
import * as service from '../services/credit-card.service'
import { requireAuth } from '../middleware/require-auth.middleware'

const router = Router()

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in request' })
    }

    const card = await service.createCard(userId, req.body)
    res.status(201).json(card)
  } catch (e) {
    next(e)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user?.id

    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const cards = await service.listCards(userId)
    res.status(200).json(cards)
  } catch (e) {
    next(e)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user?.id
    const cardId = req.params.id

    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const card = await service.updateCard(cardId, userId, req.body)
    res.status(200).json(card)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user?.id
    const cardId = req.params.id

    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    await service.deleteCard(cardId, userId)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
})

export default router
