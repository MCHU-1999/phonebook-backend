const express = require('express')
var morgan = require('morgan')
var { data } = require('./data')
const cors = require('cors')


const PORT = 3001
const app = express()

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  } else {
    return ' '
  }
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/healthz', (request, response) => {
  response.status(200).end()
})

app.get('/api/persons', (request, response) => {
  response.status(200).json(data)
})

app.post('/api/persons', (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      status: 'error',
      message: `Missing arguments 'name' or 'number'`
    })
  }
  if (data.find(element => element.name === request.body.name)) {
    return response.status(400).json({
      status: 'error',
      message: `The name already exists in the phonebook`
    })
  }
  const newId = getRandomInt(50000)
  if (data.find(element => element.id === newId)) {
    return response.status(400).json({
      status: 'error',
      message: `Duplicated id, try again`
    })
  }

  const newPerson = {
    id: newId,
    name: request.body.name,
    number: request.body.number
  }
  data = data.concat(newPerson)
  response.status(200).json({
    status: 'success',
    message: 'New data created',
    data: newPerson
  })
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

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const found = data.find(element => element.id === id)

  data = data.filter(element => element.id !== id)

  if (found) {
    response.status(204).end()
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