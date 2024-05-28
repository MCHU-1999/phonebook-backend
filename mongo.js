const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://jae:${password}@fullstack-m0.s7udqas.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fullstack-M0`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // display all of the entries in the phonebook
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(element => console.log(`${element.name} ${element.number}`))
    mongoose.connection.close()
  })
} else if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]
  if (!name || !number) {
    console.log("missing arguments 'name' or 'number'")
    process.exit(1)
  }
  const person = new Person({ name, number })
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  process.exit(1)
}




