import cors, { type CorsOptions } from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

import { HttpError } from './lib/http-error'
import authRouter, { loginHandler, registerHandler } from './routes/auth.routes'
import userRouter from './routes/user.routes'

const allowedOrigins = ['http://localhost:3000', 'https://despesai.com.br']

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (allowedOrigins.includes(origin || '')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

export function createApp() {
  const app = express()

  app.use(express.json())
  app.use(cors(corsOptions))

  app.use('/auth', authRouter)
  app.post('/user', registerHandler)
  app.post('/user/me', loginHandler)
  app.use('/user', userRouter)

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
      res.status(400).json({ error: 'Validation failed', details: err.flatten() })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }

  app.use(errorHandler)
  return app
}
