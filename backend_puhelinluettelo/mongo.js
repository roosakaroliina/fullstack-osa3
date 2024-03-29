const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.kwe6pfl.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('phonebook', phonebookSchema)
const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
  name: name,
  number: number,
})

if (process.argv.length === 3){
    console.log('phonebook:')
    Person.find({}).then(persons => {
        persons.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
}
else if (process.argv.length === 5){


person.save().then(persons => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}