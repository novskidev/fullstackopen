import { useState, useEffect } from 'react'
import persons from './services/persons'

const App = () => {
  const [personsAll, setPersonsAll] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')


  useEffect(() => {
     persons.getAll().then((response) => {
       setPersonsAll(response.data)
     })
  })
  

  const handleClick = (e) => {
    e.preventDefault()
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
  } else {
    setPersons(persons.concat({ name: newName, number: newNumber }))
    setNewName('')
  }
  }
 
  return (
    <div>
      <h2>Phonebook</h2>
      filter shown with <input />
      <form>
        <div>
          name: <input value={newName} onChange={event => setNewName(event.target.value)} /> <br />
          number: <input value={newNumber} onChange={event => setNewNumber(event.target.value)}/>
        </div>
        <div>
          <button onClick={handleClick} type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsAll.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )
}

export default App