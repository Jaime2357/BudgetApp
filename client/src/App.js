import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';



function App() {

  const [variable, setVariable] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/variable')
      .then(response => response.json())
      .then(data => setVariable(data.value))
      .catch(error => console.error('Error fetching variable:', error));
  }, []);

  console.log(variable);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React - {variable}
        </a>
      </header>
    </div>
  );
}

export default App;
