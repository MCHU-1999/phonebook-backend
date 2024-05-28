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


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  Person.find({}).then(people => {
    response.send(`<p>Phonebook has info for ${people.length} people</p><p>${Date().toString()}</p>`)
  })
})

app.get('/healthz', (request, response) => {
  response.status(200).end()
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(people => {
    response.status(200).json(people)
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  if (!request.body.name || !request.body.number) {
    return response.status(422).json({
      status: 'error',
      message: `Missing arguments 'name' or 'number'`
    })
  }
  Person.find({ name: request.body.name }).then(person => {
    // console.log("person", person)
    if (person.length !== 0) {
      return response.status(409).json({
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
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.json(result)
    // response.status(204).end()
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  if (!request.body.name || !request.body.number) {
    return response.status(422).json({
      status: 'error',
      message: `Missing arguments 'name' or 'number'`
    })
  }

  const newPerson = {
    name: request.body.name,
    number: request.body.number,
  }

  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ status: 'error', message: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === 'CastError') {
    // console.log('CastError');
    return response.status(400).send({ status: 'error', message: 'malformatted id' })
  } else {
    // console.log({ status: 'error', message: error.message });
    // return response.status(400).send({ status: 'error', message: error.message })
  }

  next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

// ---------------------------------------------------------
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})