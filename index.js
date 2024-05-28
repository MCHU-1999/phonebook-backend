const express = require('express')
var morgan = require('morgan')
// var { data } = require('./data')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body)
  } else {
    return ' '
  }
})

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use('/', express.static('dist'))

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/healthz', (request, response) => {
  response.status(200).end()
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.status(200).json(people)
  }).catch(error => {
    response.status(400).json({
      status: 'error',
      message: error.message
    })
  })
})

app.post('/api/persons', (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(500).json({
      status: 'error',
      message: `Missing arguments 'name' or 'number'`
    })
  }
  Person.find({ name: request.body.name }).then(person => {
    // console.log("person", person)
    if (person.length !== 0) {
      return response.status(500).json({
        status: 'error',
        message: `The name already exists in the phonebook`
      })
    } else {
      const newPerson = new Person({
        name: request.body.name,
        number: request.body.number
      })
      newPerson.save().then(saved => {
        response.json(saved)
      })
    }
  }).catch(error => {
    return response.status(500).json({
      status: 'error',
      message: error.message
    })
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).json({
        status: 'error',
        message: `No data corresponds to id: ${request.params.id}`
      })
    }
  }).catch(error => {
    response.status(400).json({
      status: 'error',
      message: 'malformatted id'
    })
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.json(result)
    // response.status(204).end()
  }).catch(error => {
    response.status(500).json({
      status: 'error',
      message: error.message
    })
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(people => {
    response.send(`<p>Phonebook has info for ${people.length} people</p><p>${Date().toString()}</p>`)
  })
})



// ---------------------------------------------------------
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})