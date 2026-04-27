import cors, { type CorsOptions } from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import swaggerUi from 'swagger-ui-express'
import { ZodError } from 'zod'

import { HttpError } from './lib/http-error'
import { openApiDocument } from './openapi/document'

import { revenueRoutes } from './routes/revenue.routes'
import { expenseRoutes } from './routes/expense.routes'
import { transactionRoutes } from './routes/transaction.routes'
import authRouter, { loginHandler, registerHandler } from './routes/auth.routes'
import userRouter from './routes/user.routes'
import bankRouter from './routes/bank.routes'
import creditCardRouter from './routes/credit-card.routes'
import { requireAuth } from './middleware/require-auth.middleware'

const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3002',
  'http://127.0.0.1:3002',
  'https://despesai.com.br',
  'https://www.despesai.com.br',
]

const extraOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])]

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}

export function createApp() {
  const app = express()

  app.use(express.json())
  app.use(cors(corsOptions))

  app.get('/openapi.json', (_req, res) => {
    res.json(openApiDocument)
  })
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customSiteTitle: 'DespesAI API',
    })
  )

  app.use('/auth', authRouter)
  // Alias when a reverse proxy forwards `/api/*` to Express (same paths as `/auth/*`).
  app.use('/api/auth', authRouter)
  app.post('/user', registerHandler)
  app.post('/user/me', loginHandler)
  app.use('/user', userRouter)
  app.use('/banks', requireAuth, bankRouter)
  app.use('/credit-cards', requireAuth, creditCardRouter)
  app.use('/revenues', requireAuth, revenueRoutes)
  app.use('/expenses', requireAuth, expenseRoutes)
  app.use('/transactions', requireAuth, transactionRoutes)

  const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (res.headersSent) {
      next(err)
      return
    }
    if (err instanceof HttpError) {
      res.status(err.statusCode).json({ error: err.message })
      return
    }
    if (err instanceof ZodError) {
      res
        .status(400)
        .json({ error: 'Validation failed', details: err.flatten() })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }

  app.use(errorHandler)
  return app
}
