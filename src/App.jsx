import React, { useState } from 'react';
import './App.css'; // Import the CSS file

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      const sanitizedInput = input.replace(/“|”/g, '"'); // Replace curly quotes with straight quotes

      const data = JSON.parse(sanitizedInput); // Parse the sanitized input as JSON
      const res = await fetch('https://21bbs0006.netlify.app/.netlify/functions/bfhl', { // Updated to Netlify backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }), // Send the data
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();
      setResponse(result);
    } catch (err) {
      setError('Invalid JSON input. Please check your input and try again.');
      console.error('Failed to fetch:', err.message);
    }
  };

  const handleFilterChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedFilters(value);
  };

  const filteredResponse = () => {
    let result = {};
    if (selectedFilters.includes("Numbers")) result.numbers = response.numbers || [];
    if (selectedFilters.includes("Alphabets")) result.alphabets = response.alphabets || [];
    if (selectedFilters.includes("Highest lowercase alphabet")) result.highest_lowercase_alphabet = response.highest_lowercase_alphabet || [];
    return result;
  };

  return (
    <div className="app-container">
      <h1>{response.roll_number || "Enter Data"}</h1>
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          placeholder='Enter JSON array, e.g., ["1", "a", "B", "2"]'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          cols={50}
          className="textarea"
        />
        <br />
        <button type="submit" className="submit-button">Submit</button>
      </form>
      {error && <div className="error-message">{error}</div>}

      {Object.keys(response).length > 0 && (
        <div className="filter-container">
          <label htmlFor="filters">Filter Response:</label>
          <select id="filters" multiple onChange={handleFilterChange} className="filter-dropdown">
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
        </div>
      )}

      <pre className="response-output">{JSON.stringify(filteredResponse(), null, 2)}</pre>
    </div>
  );
}

export default App;
