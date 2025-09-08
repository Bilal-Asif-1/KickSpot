import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import http from 'http'
import { Server } from 'socket.io'
import { sequelize } from './lib/sequelize'
import router from './routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api', router)

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || 500
  res.status(status).json({ message: err.message || 'Internal Server Error' })
})

const server = http.createServer(app)
export const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', () => {})

const PORT = process.env.PORT || 5000

async function start() {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    server.listen(PORT, () => console.log(`API running on :${PORT}`))
  } catch (e) {
    console.error('Failed to start server', e)
    process.exit(1)
  }
}

start()


