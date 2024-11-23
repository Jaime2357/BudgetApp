const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

const { default: JdbcDriver, ConnectionType } = require("node-jdbc-driver");
const { get } = require('https');
ConnectionType.postgreSql // for postgreSql connection

const host = 'localhost'; // Change based on host
const port = '5000'; // Change based on port
const database = 'jaime'; // Change based on dbName
const username = 'jaime';
const password = 'devpass';

// Set optional parameters
const minpoolsize = '0'
const maxpoolsize = '500'

const jdbcUrl = `jdbc:postgresql://${host}:${port}/${database}` // DB-URL
const jdbc = new JdbcDriver(ConnectionType.postgreSql, { jdbcUrl, username, password });

// Create necessary tables 
// (Note that Postgress uses SERIAL instead of AUTO_Increment)
async function createTables() { 
  const createUsers = `
    CREATE TABLE IF NOT EXISTS Users (
      user_id SERIAL PRIMARY KEY,
      password VARCHAR(25) NOT NULL,
      username VARCHAR(25) NOT NULL UNIQUE
    );`;
  
  const createBalances = `
    CREATE TABLE IF NOT EXISTS Balances (
      balance_id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      balance_name VARCHAR(20) NOT NULL UNIQUE,
      balance_type 
        VARCHAR(20) NOT NULL CHECK (balance_type = 'wallet' OR balance_type = 'credit'),
      amount DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
      FOREIGN KEY (user_id) REFERENCES Users(user_id)
    );`;

  const createTransactions = `
    CREATE TABLE IF NOT EXISTS Transactions (
      transaction_id SERIAL PRIMARY KEY,
      balance_id INT NOT NULL,
      user_id INT NOT NULL,
      transaction_name VARCHAR(20) NOT NULL UNIQUE,
      transaction_type VARCHAR(20) 
        NOT NULL CHECK (transaction_type = 'spending' OR transaction_type = 'income'),
      amount DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
      transaction_date DATE DEFAULT CURRENT_DATE,
      transaction_time TIME DEFAULT CURRENT_TIME,
      FOREIGN KEY (balance_id) REFERENCES Balances(balance_id),
      FOREIGN KEY (user_id) REFERENCES Users(user_id)
    );`;

  try {
    await jdbc.ddl(createUsers);
    await jdbc.ddl(createBalances);
    await jdbc.ddl(createTransactions);
  } catch(e) {
    console.log("Error:", e);
  }
}

// Functions to add rows
async function newUser(username, password){ //Add hashing later

  const insertUser = `
    INSERT INTO 
      Users (username, password)
    VALUES (
      '${username}', '${password}'
    )
    ON CONFLICT (username) DO NOTHING;`;

  try{
    await jdbc.ddl(insertUser);
  }
  catch(e){
    console.log("Error: ", e);
  }
}

async function newBalance(user_id, balance_name, balance_type, amount){

  const insertBalance = `
    INSERT INTO Balances (
      user_id, 
      balance_name, 
      balance_type, 
      amount
    ) VALUES (
      '${user_id}', 
      '${balance_name}', 
      '${balance_type}', 
      '${amount}'
    )
    ON CONFLICT (balance_name) DO NOTHING;`;

  try{
    const result = await jdbc.ddl(insertBalance);
    return result;
  }
  catch(e){
    console.log("Error: ", e);
  }
}

async function newTransaction(user_id, balance_id, transaction_name, transaction_type, amount){

  const insertTransaction = `
    INSERT INTO Transactions (
      balance_id, 
      user_id,
      transaction_name, 
      transaction_type, 
      amount
    ) VALUES (
      '${balance_id}', 
      '${user_id}',
      '${transaction_name}', 
      '${transaction_type}', 
      '${amount}'
    )
    ON CONFLICT (transaction_name) DO NOTHING;`;

  try{
    await jdbc.ddl(insertTransaction);
  }
  catch(e){
    console.log("Error: ", e);
  }
}

// Functions to Delete Rows
async function deleteTransaction(transaction_id){

  const removeTransaction = `
    DELETE FROM Transactions 
    WHERE transaction_id = '${transaction_id}';
    `;

  try{
    await jdbc.ddl(removeTransaction);
  }
  catch(e){
    console.log("Error: ", e);
  }
}

async function deleteBalance(balance_id){

  const removeTransactions = `
    DELETE FROM Transactions
    WHERE balance_id = '${balance_id}';
    `;

  const removeBalance = `
    DELETE FROM Balances 
    WHERE balance_id = '${balance_id}';
    `;

  try{
    await jdbc.ddl(removeTransactions);
    await jdbc.ddl(removeBalance);
  }
  catch(e){
    console.log("Error: ", e);
  }
}

async function deleteUser(user_id){

  const removeTransactions = `
    DELETE FROM Transactions
    WHERE user_id = '${user_id}';
    `;

  const removeBalance = `
    DELETE FROM Balances 
    WHERE user_id = '${user_id}';
    `;

  const removeUsers = `
    DELETE FROM Users 
    WHERE user_id = '${user_id}';
    `;

  try{
    await jdbc.ddl(removeTransactions);
    await jdbc.ddl(removeBalance);
    await jdbc.ddl(removeUsers);
  }
  catch(e){
    console.log("Error: ", e);
  }
}

// Access Functions
// Proper Login with hashing is for later
async function login(username, password){ 

  const selectUser = `
    SELECT user_id
    FROM Users
    WHERE (
      username = '${username}'
      AND
      password = '${password}'
    );
  `

  try{
    const result = await jdbc.sql(selectUser);
    if(result.length == 0 || result.length > 1){
      return null;
    }
    else{
      return result[0].user_id;
    }
  }
  catch(e){
    console.log("Error: ", e);
  }
}

// Balance Getter and Parsers -----------------------------------------------------------------------
// JDBC Returns a string of the results, so we need functions to parse

function parseBalanceRow(rowString) {
  // Remove the outer parentheses and split by comma
  const values = rowString.slice(1, -1).split(',');

  // Create a structured object
  return {
    balance_id: parseInt(values[0], 10),
    balance_name: values[1].replace(/'/g, '').trim(), // Remove quotes if present
    balance_type: values[2].replace(/'/g, '').trim(),
    amount: parseFloat(values[3])
  };
}

// Function to parse all rows -----------------------------
function parseBalanceResult(jdbcResult) {
  return jdbcResult.map(item => parseBalanceRow(item.row));
}

//Parsers ----------------------------------------------
async function getBalances(user_id){ 

  const grabBalances = `
    SELECT (
      balance_id, 
      balance_name,
      balance_type,
      amount)
    FROM Balances
    WHERE user_id = '${user_id}';
  `;

  try{
    const result = await jdbc.sql(grabBalances);
    if(result.length === 0){
      return [];
    }
    else{

      const parsedMap = parseBalanceResult(result)
      return parsedMap;
    }
  }
  catch(e){
    console.log("Error: ", e);
  }
}

async function getUserName(user_id){ 

  const grabName = `
    SELECT (username)
    FROM Users
    WHERE user_id = '${user_id}';
  `;

  try{
    const result = await jdbc.sql(grabName);
    return result;
  }
  catch(e){
    console.log("Error: ", e);
  }
}




//getter functions-------------------------------------

app.get('/api/getBalances', async (req, res) => {
  const user_id = req.query.user_id[0];
  const balanceArray = await getBalances(user_id);
  res.json(balanceArray);
});

app.get('/api/getNames', async (req, res) => {
  const user_id = req.query.user_id[0];
  const name = await getUserName(user_id);
  res.json(name);
});

//setter functions ------------------------------------

app.post('/api/createTables', async (req, res) => {
  await createTables();
  res.sendStatus(204);
})

app.post('/api/insertBalance', async (req, res) => {
  const user_id = req.query.user_id;
  const balance_name = req.query.balance_name;
  const balance_type = req.query.balance_type;
  const amount = req.query.amount;

  try{
    const insertCode = await newBalance(user_id, balance_name, balance_type, amount);
    console.log("Insert Code:", insertCode);
    if(insertCode === 1){
      res.sendStatus(204);
    }
    else{
      res.sendStatus(201);
    }
  }
  catch(error){
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/api/deleteTable', async (req, res) => {
  const balance_id = req.query.balance_id;
  console.log(balance_id);
  await deleteBalance(balance_id);
  res.sendStatus(204);
})

app.listen(3001, () => console.log('Server running on port 3001'));
