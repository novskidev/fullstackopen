import { useState, useEffect } from "react";
import persons from "./services/persons";

const App = () => {
  const [personsAll, setPersonsAll] = useState([]);
  const [originalPersonsAll, setOriginalPersonsAll] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    persons.getAll().then((response) => {
      setPersonsAll(response.data);
      setOriginalPersonsAll(response.data);
    });
  }, []);

  const handleDelete = (id) => {
    const personToDelete = personsAll.find((person) => person.id === id);
    if (!personToDelete) {
      alert("Kontak tidak ditemukan!");
      return;
    }

    const isConfirm = window.confirm(`Delete ${personToDelete.name} ?`);
    if (isConfirm) {
      persons.remove(id)
        .then(() => {
          setPersonsAll(personsAll.filter((person) => person.id !== id));
          setOriginalPersonsAll(originalPersonsAll.filter((person) => person.id !== id));
        })
        .catch(() => {
          alert("Gagal menghapus. Mungkin sudah dihapus sebelumnya dari server.");
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
    if (personsAll.find((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const personObject = { name: newName, number: newNumber };

      persons.create(personObject).then((response) => {
        setPersonsAll(personsAll.concat(response.data));
        setOriginalPersonsAll(originalPersonsAll.concat(response.data));
        setNewName("");
        setNewNumber("");
      }).catch(() => {
        alert("Gagal menambahkan kontak.");
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
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
