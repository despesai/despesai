import './lib/prisma'
import { createApp } from './app'

const port = Number(process.env.PORT) || 3002
const app = createApp()

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
