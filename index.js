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

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const found = data.find(element => element.id === id)

  if (found) {
    response.status(200).json(found)
  } else {
    response.status(404).json({
      status: 'error',
      message: `No data corresponds to id: ${id}`
    })
  }
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${data.length} people</p><p>${Date().toString()}</p>`)
})



// ---------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})