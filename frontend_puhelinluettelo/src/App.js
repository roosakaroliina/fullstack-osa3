import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ message, errorMessage }) => {
  if (message === null && errorMessage === null) {
    return null
  }

  if (errorMessage !== null) {
    return (
      <div className="error">
        {errorMessage}
      </div>
    )
  }

  return (
    <div className="message">
      {message}
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      <p>
        filter shown with <input
          value={props.value}
          onChange={props.handleFilterChange}
        />
      </p>
    </div>
  )
}

const PersonFrom = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input
          value={props.newName}
          onChange={props.handleNameChange}
        />
      </div>
      <div>number: <input
        value={props.newNumber}
        onChange={props.handleNumberChange}
      />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (props) => {
  return (
    <div>
      {props.filterPersons.map(person =>
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => props.removePerson(person.id, person.name)}>delete</button>
        </p>
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)




  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    const foundPerson = persons.find(person => person.name === personObject.name)
    if (foundPerson) {
      const confirmed = window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)
      if (confirmed) {
        console.log(foundPerson.id)
        personService
          .update(foundPerson.id, personObject)
          .catch(error => {
            setErrorMessage(
              `Information of ${foundPerson.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(n => n.id !== foundPerson.id))
          })
          .then(() => {
            let newPersons = [...persons]
            let newPerson = newPersons.find(person => person.name === personObject.name)
            newPerson.number = personObject.number
            setPersons(newPersons)
          })
        setNewName('')
        setNewNumber('')
        setMessage(
          `Changed the number of ${personObject.name}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
      return
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      })
    setMessage(
      `Added ${personObject.name}`
    )
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    setNewName('')
    setNewNumber('')
  }

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .catch(error => {
          setErrorMessage(
            `Information of ${name} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(n => n.id !== id))
        })
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
      setMessage(
        `Removed ${name}`
      )
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const filterPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} errorMessage={errorMessage} />
      <Filter value={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonFrom newName={newName} newNumber={newNumber}
        addPerson={addPerson} handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons filterPersons={filterPersons} removePerson={removePerson} />
    </div>
  )
}

export default App