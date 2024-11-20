const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

const { default: JdbcDriver, ConnectionType } = require("node-jdbc-driver");
ConnectionType.postgreSql // for postgreSql connection

const host = 'localhost'; // Change based on host
const port = 'port'; // Change based on port
const database = 'Budgetdb'; // Change based on dbName
const username = '<jaime>';
const password = '';

// Set optional parameters
const minpoolsize = '0'
const maxpoolsize = '500'

const jdbcUrl = `jdbc:postgresql://localhost`
const jdbc = new JdbcDriver(ConnectionType.postgreSql, { jdbcUrl, username, password });

const version = jdbc.get_version();

app.get('/api/variable', (req, res) => {
  res.json({ value: version });
});

app.listen(3001, () => console.log('Server running on port 3001'));