import express from 'express'
import { prisma } from '../lib/prisma'

const app = express()
const port = 8080

app.use(express.json())

// GET root
app.get('/', (req, res) => {
  res.send('Hello from Prisma API!')
})

// CREATE USER
app.post('/user', async (req, res) => {
  const { name, email } = req.body
  try {
    const user = await prisma.user.create({
      data: { name, email },
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// GET ALL USERS
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// UPDATE USER
app.put('/user/:id', async (req, res) => {
  const { id } = req.params
  const { name, email } = req.body

  try {
    const user = await prisma.user.update({
      where: { id }, // ต้องใช้ id ไม่ใช่ Userid
      data: { name, email },
    })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})