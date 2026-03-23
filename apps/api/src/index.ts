import express from 'express'
import prisma from './lib/prisma'
const app = express()
app.use(express.json())
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

app.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: {
        id,
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
