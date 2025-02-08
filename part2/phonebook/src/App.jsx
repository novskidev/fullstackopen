import { useState, useEffect } from "react";
import persons from "./services/persons";

const App = () => {
  const [personsAll, setPersonsAll] = useState([]);
  const [originalPersonsAll, setOriginalPersonsAll] = useState([]); // Simpan data asli
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    persons.getAll().then((response) => {
      setPersonsAll(response.data);
      setOriginalPersonsAll(response.data); // Simpan data asli
    });
  }, []);

  console.log(personsAll);

  const handleDelete = (e) => {
    e.preventDefault();
    persons.remove(e.target.value);
  };

  const handleChange = (e) => {
    setFilter(e.target.value);
    const filtered = originalPersonsAll.filter((person) =>
      person.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setPersonsAll(filtered);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (personsAll.find((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      persons.create(personObject);
      setPersonsAll(personsAll.concat(personObject));
      setOriginalPersonsAll(originalPersonsAll.concat(personObject)); // Update juga data asli
      setNewName("");
      setNewNumber("");
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      filter shown with <input value={filter} onChange={handleChange} />
      <form>
        <div>
          name:{" "}
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />{" "}
          <br />
          number:{" "}
          <input
            value={newNumber}
            onChange={(event) => setNewNumber(event.target.value)}
          />
        </div>
        <div>
          <button onClick={handleClick} type="submit">
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsAll.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}{" "}
          <button value={person.id} onClick={handleDelete}>
            delete
          </button>
        </p>
      ))}
    </div>
  );
};

export default App;
