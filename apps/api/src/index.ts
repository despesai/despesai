import express from 'express'
import cors, { CorsOptions } from 'cors'
import prisma from './lib/prisma'

const allowedOrigins = ['http://localhost:3000', 'https://despesai.com.br']

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin || '')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

const app = express()

app.use(express.json())
app.use(cors(corsOptions))

const port = '3002'

app.post('/user', async (req, res) => {
  try {
    const { name, email, password } = req.body

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: 'User already exists' })
  }
})

app.post('/user/me', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: {
        email,
        password,
      },
      omit: {
        password: true,
      },
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: 'User not found' })
  }
})

app.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    })
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: 'Error' })
  }
})

app.listen(port, () => {
  console.log(`Example app listening ooo on port ${port}`)
})
