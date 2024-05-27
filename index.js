const express = require('express')
const { data } = require('./data')

const PORT = 3001
const app = express()

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.status(200).json(data)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})