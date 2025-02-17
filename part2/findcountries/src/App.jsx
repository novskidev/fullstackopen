import { useState, useEffect } from 'react';
import getAllCountries from './services/countriesServices';

function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    getAllCountries().then((allCountries) => {
      setCountries(allCountries);
    });
  }, []);

  useEffect(() => {
    if (query) {
      const matches = countries.filter(country => 
        country.name.common.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCountries(matches);
      setSelectedCountry(null);
    } else {
      setFilteredCountries([]);
      setSelectedCountry(null);
    }
  }, [query, countries]);

  const handleShow = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <h1>Country Search</h1>
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search for a country..."
      />
      {filteredCountries.length > 10 && <p>Too many matches, please specify further.</p>}
      {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common} <button onClick={() => handleShow(country)}>Show</button>
            </li>
          ))}
        </ul>
      )}
      {(filteredCountries.length === 1 || selectedCountry) && (
        <div>
          <h2>{(selectedCountry || filteredCountries[0]).name.common}</h2>
          <p>Capital: {(selectedCountry || filteredCountries[0]).capital?.[0]}</p>
          <p>Area: {(selectedCountry || filteredCountries[0]).area} km²</p>
          <h3>Languages:</h3>
          <ul>
            {Object.values((selectedCountry || filteredCountries[0]).languages).map(lang => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
          <img src={(selectedCountry || filteredCountries[0]).flags.png} alt={`Flag of ${(selectedCountry || filteredCountries[0]).name.common}`} width="150" />
        </div>
      )}
    </div>
  );
}

export default App;
