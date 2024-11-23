const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

const { default: JdbcDriver, ConnectionType } = require("node-jdbc-driver");
ConnectionType.postgreSql // for postgreSql connection

const host = 'localhost'; // Change based on host
const port = '5000'; // Change based on port
const database = 'taanishq'; // Change based on dbName
const username = 'taanishqsethi'; // Change based on username
//const password = 'devpass';

// Set optional parameters
const minpoolsize = '0'
const maxpoolsize = '500'

const jdbcUrl = `jdbc:postgresql://${host}:${port}/${database}` // DB-URL
const jdbc = new JdbcDriver(ConnectionType.postgreSql, { jdbcUrl, username});

var testval;

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
    await jdbc.ddl(insertBalance);
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







//To test functions
app.get('/api/variable', async (req, res) => {
  await deleteUser(2);
  res.json({value: 0});
});

(async () => {
  try {
    await createTables(); // Ensure tables are created before starting the server
    app.listen(3001, () => console.log('Server running on port 3001'));
  } catch (error) {
    console.error("Error initializing the database:", error);
  }
})();