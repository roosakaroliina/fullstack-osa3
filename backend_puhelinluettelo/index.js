const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/phonebook')

app.use(cors())

app.use(express.static('build'))

app.use(express.json())

morgan.token("data", request => {
    return JSON.stringify(request.body)
  })


app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
      })
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
    res.send('<p>Phonebook has info for ' + persons.length + ' people</p>'
        + '<p>' + new Date + ' </p>')
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateRandomId = (max) => {
    return Math.floor(Math.random() * max);

}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }



    const foundPerson = persons.find(person => person.name === body.name)
    if (foundPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        id: generateRandomId(200),
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
      })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
