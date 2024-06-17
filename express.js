const express = require('express')
const usuarios = require('./usuario.json')
const crypto = require('node:crypto')
const cors = require('cors')
const { validatePartial, validateSchema } = require('./schemas/usuario.js')

const app = express()

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'https://decidijc.com/'
]

app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.get('/api/usuarios', (req, res) => {
  res.json(usuarios)
})

app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params
  const usuario = usuarios.find(element => element.id === parseInt(id))

  if (!usuario) {
    return res.status(404).json({ message: 'Error usuario no encontrado' })
  }

  res.json(usuario)
})

app.post('/api/usuarios', (req, res) => {
  const result = validateSchema(req.body)

  if (result.error) {
    return res.status(400).json({ error: result.error })
  }

  const newUsuario = {
    id: crypto.randomInt(1, 10000),
    ...result.data
  }

  usuarios.push(newUsuario)

  res.status(201).json(newUsuario)
})

app.patch('/usuarios/:id', (req, res) => {
  const result = validatePartial(req.body)
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const usuarioIndex = usuarios.findIndex(usuario => usuario.id === id)
  if (usuarioIndex === -1) {
    return res.status(404).json({ message: 'Usuario not found' })
  }

  const updateUsuario = {
    ...usuarios[usuarioIndex],
    ...result.data
  }

  usuarios[usuarioIndex] = updateUsuario

  return res.json(updateUsuario)
})

/*
app.options('/usuarios/:id', (req, res) => {
  const origin = req.header('origin')

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST , PUT, PATCH, DELETE')
  }

  res.send(200)
})
*/
const port = process.env.PORT ?? 1234

app.listen(port, () => {
  console.clear()
  console.log(`Tu web esta en http://localhost:${port}`)
})
