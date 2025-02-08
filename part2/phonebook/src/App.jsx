import { useState, useEffect } from "react";
import persons from "./services/persons";

const App = () => {
  const [personsAll, setPersonsAll] = useState([]);
  const [originalPersonsAll, setOriginalPersonsAll] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    persons.getAll().then((response) => {
      setPersonsAll(response.data);
      setOriginalPersonsAll(response.data);
    });
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleDelete = (id) => {
    const personToDelete = personsAll.find((person) => person.id === id);
    if (!personToDelete) {
      alert("Contact not found!");
      return;
    }

    const isConfirm = window.confirm(`Delete ${personToDelete.name} ?`);
    if (isConfirm) {
      persons.remove(id)
        .then(() => {
          setPersonsAll(personsAll.filter((person) => person.id !== id));
          setOriginalPersonsAll(originalPersonsAll.filter((person) => person.id !== id));
          showNotification(`${personToDelete.name} deleted successfully.`);
        })
        .catch(() => {
          alert("Failed to delete contact.");
        });
    }
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;
    setFilter(searchValue);

    if (searchValue === "") {
      setPersonsAll(originalPersonsAll);
    } else {
      const filtered = originalPersonsAll.filter((person) =>
        person.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setPersonsAll(filtered);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    const existingPerson = personsAll.find((person) => person.name === newName);
    
    if (existingPerson) {
      const isConfirm = window.confirm(
        `${newName} is already in the phonebook. Replace the old number with the new one?`
      );
      
      if (isConfirm) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        
        persons.update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersonsAll(personsAll.map((person) => 
              person.id !== existingPerson.id ? person : response.data
            ));
            setOriginalPersonsAll(originalPersonsAll.map((person) => 
              person.id !== existingPerson.id ? person : response.data
            ));
            setNewName("");
            setNewNumber("");
            showNotification(`${newName}'s number updated successfully.`);
          })
          .catch(() => {
            alert("Failed to update contact.");
          });
      }
    } else {
      const personObject = { name: newName, number: newNumber };
      
      persons.create(personObject).then((response) => {
        setPersonsAll(personsAll.concat(response.data));
        setOriginalPersonsAll(originalPersonsAll.concat(response.data));
        setNewName("");
        setNewNumber("");
        showNotification(`${newName} added successfully.`);
      }).catch(() => {
        alert("Failed to add contact.");
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {notification && <div style={{ color: "green", marginBottom: "10px" }}>{notification}</div>}
      filter shown with <input value={filter} onChange={handleChange} />
      <form>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} /> <br />
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button onClick={handleClick} type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsAll.map((person) => (
        <p key={person.id}>
          {person.name} {person.number} {" "}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </p>
      ))}
    </div>
  );
};

export default App;
