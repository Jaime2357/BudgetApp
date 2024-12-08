const express = require('express');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');

// Enable CORS for all routes
app.use(cors());

// Enable JSON parsing
app.use(express.json());

const { default: JdbcDriver, ConnectionType } = require("node-jdbc-driver");
const { get } = require('https');
ConnectionType.postgreSql // for postgreSql connection

const host = 'localhost'; // Change based on host
const port = '5000'; // Change based on port
const database = 'taanishq'; // Change based on dbName
const username = 'taanishqsethi';
//const password = 'devpass';

// Set optional parameters
const minpoolsize = '0'
const maxpoolsize = '500'

const jdbcUrl = `jdbc:postgresql://${host}:${port}/${database}` // DB-URL
const jdbc = new JdbcDriver(ConnectionType.postgreSql, { jdbcUrl, username});

// Create necessary tables 
// (Note that Postgress uses SERIAL instead of AUTO_Increment)
async function createTables() {
  const createUsers = `
    CREATE TABLE IF NOT EXISTS Users (
      user_id SERIAL PRIMARY KEY,
      password VARCHAR(100) NOT NULL,
      username VARCHAR(50) NOT NULL UNIQUE
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
        NOT NULL CHECK (transaction_type IN ('spending', 'income', 'transfer', 'pay credit')), -- Updated to include more types
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
  } catch (e) {
    console.log("Error:", e);
  }
}

// Functions to add rows
async function newUser(username, password) {

  const hashedPass = await bcrypt.hash(password, 10);

  const escapedUsername = username.replace(/'/g, "''");

  const insertUser = `
    INSERT INTO 
      Users (username, password)
    VALUES (
      '${escapedUsername}', '${hashedPass}'
    )
    ON CONFLICT (username) DO NOTHING;`;

  try {
    const result = await jdbc.ddl(insertUser);
    return result;
  }
  catch (e) {
    console.log("Error: ", e);
  }
}

async function newBalance(user_id, balance_name, balance_type, amount) {

  const escapedBalanceName = balance_name.replace(/'/g, "''");

  const insertBalance = `
    INSERT INTO Balances (
      user_id, 
      balance_name, 
      balance_type, 
      amount
    ) VALUES (
      ${user_id}, 
      '${escapedBalanceName}', 
      '${balance_type}', 
      ${amount}
    )
    ON CONFLICT (balance_name) DO NOTHING;`;
  try {
    const result = await jdbc.ddl(insertBalance);
    return result;
  }
  catch (e) {
    console.log("Error: ", e);
  }
}

// Transaction functions =================================================================================

async function newTransaction(user_id, balance_id, transaction_name, transaction_type, amount) {
  if (!user_id || !balance_id || !transaction_name || !transaction_type || amount === undefined) {
      throw new Error("Invalid input parameters");
  }

  // Verify user_id exists
  const checkUserQuery = `SELECT COUNT(*) FROM Users WHERE user_id = ${user_id};`;
  const userExists = await jdbc.sql(checkUserQuery);
  if (userExists[0].count === "0") {
      throw new Error(`User ID ${user_id} does not exist.`);
  }

  // Verify balance_id exists
  const checkBalanceQuery = `SELECT COUNT(*) FROM Balances WHERE balance_id = ${balance_id};`;
  const balanceExists = await jdbc.sql(checkBalanceQuery);
  if (balanceExists[0].count === "0") {
      throw new Error(`Balance ID ${balance_id} does not exist.`);
  }

  const validTransactionTypes = ['spending', 'income', 'transfer', 'pay credit'];

if (!validTransactionTypes.includes(transaction_type)) {
    throw new Error(`Invalid transaction type: ${transaction_type}`);
}

  const escapedTransactionName = transaction_name.replace(/'/g, "''");
  const insertTransaction = `
      INSERT INTO Transactions (
          balance_id, 
          user_id,
          transaction_name, 
          transaction_type, 
          amount
      ) VALUES (
          ${balance_id}, 
          ${user_id},
          '${escapedTransactionName}', 
          '${transaction_type}', 
          ${amount}
      )
      ON CONFLICT (transaction_name) DO NOTHING;
  `;

  console.log("Executing query:", insertTransaction); // Debugging log

  try {
      const result = await jdbc.ddl(insertTransaction);
      if (result === 0) {
          throw new Error("Transaction name already exists");
      }
  } catch (e) {
      console.error("Error inserting transaction:", e);
      throw e; // Propagate the error
  }
}




// Functions to Delete Rows
async function deleteTransaction(transaction_id) {

  const removeTransaction = `
    DELETE FROM Transactions 
    WHERE transaction_id = ${transaction_id};
    `;

  try {
    await jdbc.ddl(removeTransaction);
  }
  catch (e) {
    console.log("Error: ", e);
  }
}

// Function to get Transaction
async function getTransaction(user_id) {
  const fetchTransactionsQuery = `
      SELECT transaction_id, balance_id, transaction_name, transaction_type, amount, transaction_date, transaction_time
      FROM Transactions
      WHERE user_id = ${user_id};
  `;

  try {
      const result = await jdbc.sql(fetchTransactionsQuery);
      return result;
  } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
  }
}


async function updateTransaction(transaction_id, transaction_name, transaction_type, amount) {
  const updateTransactionQuery = `
    UPDATE Transactions
    SET transaction_name = '${transaction_name}', transaction_type = '${transaction_type}', amount = ${amount}
    WHERE transaction_id = ${transaction_id};
  `;

  try{
    await jdbc.ddl(updateTransactionQuery);
  }catch(error){
    console.error("Error updating transaction:", error);
    throw error;
  }
}

async function updateBalances(transaction_type, balance_id, amount, to_balance_id = null) {
  try {
      if (transaction_type === "spending") {
          await jdbc.ddl(`
              UPDATE Balances
              SET amount = amount - ${amount}
              WHERE balance_id = ${balance_id};
          `);
      } else if (transaction_type === "income") {
          await jdbc.ddl(`
              UPDATE Balances
              SET amount = amount + ${amount}
              WHERE balance_id = ${balance_id};
          `);
      } else if (transaction_type === "transfer") {
          if (!to_balance_id) throw new Error("Target balance ID is required for transfer");
          await jdbc.ddl(`
              UPDATE Balances
              SET amount = amount - ${amount}
              WHERE balance_id = ${balance_id};
          `);
          await jdbc.ddl(`
              UPDATE Balances
              SET amount = amount + ${amount}
              WHERE balance_id = ${to_balance_id};
          `);
      } else if (transaction_type === "pay credit") {
          await jdbc.ddl(`
              UPDATE Balances
              SET amount = amount - ${amount}
              WHERE balance_id = ${balance_id};
          `);
      } else {
          throw new Error("Invalid transaction type");
      }
  } catch (error) {
      console.error("Error updating balances:", error);
      throw error;
  }
}
// Balances Functions ====================================================================================
async function deleteBalance(balance_id) {

  const removeTransactions = `
    DELETE FROM Transactions
    WHERE balance_id = ${balance_id};
    `;

  const removeBalance = `
    DELETE FROM Balances 
    WHERE balance_id = ${balance_id};
    `;

  try {
    await jdbc.ddl(removeTransactions);
    await jdbc.ddl(removeBalance);
  }
  catch (e) {
    console.log("Error: ", e);
  }
}

async function deleteUser(user_id) {

  const removeTransactions = `
    DELETE FROM Transactions
    WHERE user_id = ${user_id};
    `;

  const removeBalance = `
    DELETE FROM Balances 
    WHERE user_id = ${user_id};
    `;

  const removeUsers = `
    DELETE FROM Users 
    WHERE user_id = ${user_id};
    `;

  try {
    await jdbc.ddl(removeTransactions);
    await jdbc.ddl(removeBalance);
    await jdbc.ddl(removeUsers);
  }
  catch (e) {
    console.log("Error: ", e);
  }
}

// Access Functions
// Proper Login with hashing is for later
async function login(username, password) {

  const escapedUsername = username.replace(/'/g, "''");

  const pullPass = `
    SELECT password
    FROM Users
    WHERE (
      username = '${escapedUsername}'
    );
  `;

  try {
    const storedPass = await jdbc.sql(pullPass);
    if (storedPass.length === 0 || storedPass.length > 1) {
      return -2; //Username not found...
    }
    else {
      const verify = await bcrypt.compare(password, storedPass[0].password);
      if (verify) {
        console.log("Verified: ", verify);
        try {

          const selectUser = `
            SELECT user_id
            FROM Users
            WHERE (
              username = '${escapedUsername}'
              AND
              password = $$${storedPass[0].password}$$
            );
          `;

          const result = await jdbc.sql(selectUser);
          console.log("Stored Password: ", storedPass);
          console.log("Hashed Search: ", result);
          if (result.length == 0 || result.length > 1) {
            return -2; //Username not found...
          }
          else {
            return result[0].user_id;
          }
        }
        catch (e) {
          console.log("Error: ", e);
        }
      }
      else {
        console.log("Verified: ", verify);
        return -1;
      }
    }

  }
  catch (e) {
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
async function getBalances(user_id) {

  const grabBalances = `
    SELECT (
      balance_id, 
      balance_name,
      balance_type,
      amount)
    FROM Balances
    WHERE user_id = ${user_id};
  `;

  try {
    const result = await jdbc.sql(grabBalances);
    if (result.length === 0) {
      return [];
    }
    else {

      const parsedMap = parseBalanceResult(result)
      return parsedMap;
    }
  }
  catch (e) {
    console.log("Error: ", e);
  }
}

async function getUserName(user_id) {

  const grabName = `
    SELECT (username)
    FROM Users
    WHERE user_id = ${user_id};
  `;

  try {
    const result = await jdbc.sql(grabName);
    return result;
  }
  catch (e) {
    console.log("Error: ", e);
  }
}




//getter functions-------------------------------------

app.get('/api/getBalances', async (req, res) => {
  const user_id = req.query.user_id;
  const balanceArray = await getBalances(user_id);
  res.json(balanceArray);
});

app.get('/api/getNames', async (req, res) => {
  const user_id = req.query.user_id;
  const name = await getUserName(user_id);
  res.json(name);
});

app.get('/api/login', async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  console.log("Login Params: ", req.query);
  const ID = await login(username, password);
  console.log(ID);
  res.json(ID);
});
app.get('/api/getTransactions', async (req, res) => {
  const user_id = req.query.user_id;

  try {
    const transactions = await getTransaction(user_id);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});



//setter functions ------------------------------------

app.post('/api/createTables', async (req, res) => {
  await createTables();
  res.sendStatus(204);
})

app.post('/api/setUser', async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  console.log("Parameters:",username,", ",password);
  try{
    const insertCode = await newUser(username, password);
    console.log("Insert Code:", insertCode);
    if (insertCode === 1) {
      console.log("Signup Complete");
      res.sendStatus(204);
    }
    else {
      res.sendStatus(201); //Name is taken
    }
  }
  catch(e){
    console.log("Error: ", e);
  }
})

app.post('/api/insertBalance', async (req, res) => {
  const user_id = req.query.user_id;
  const balance_name = req.query.balance_name;
  const balance_type = req.query.balance_type;
  const amount = req.query.amount;

  try {
    const insertCode = await newBalance(user_id, balance_name, balance_type, amount);
    console.log("Insert Code:", insertCode);
    if (insertCode === 1) {
      res.sendStatus(204);
    }
    else {
      res.sendStatus(201);
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/api/deleteTable', async (req, res) => {
  const balance_id = req.query.balance_id;
  console.log(balance_id);
  await deleteBalance(balance_id);
  res.sendStatus(204);
})

app.delete('/api/getTransactions/:transaction_id', async (req, res) => {
  const { transaction_id } = req.params;

  try {
    await deleteTransaction(transaction_id); // Pass the transaction_id
    res.sendStatus(204); // Success
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
});

app.post('/api/newTransactions', async (req, res) => {
  const { user_id, balance_id, transaction_name, transaction_type, amount, to_balance_id } = req.body;

  console.log("Received data:", { user_id, balance_id, transaction_name, transaction_type, amount, to_balance_id });

  if (!user_id || !balance_id || !transaction_name || !transaction_type || amount === undefined || 
      (transaction_type === "transfer" && !to_balance_id)) {
      return res.status(400).json({ message: 'All fields are required, including target balance for transfers.' });
  }

  try {
      await newTransaction(user_id, balance_id, transaction_name, transaction_type, amount);
      await updateBalances(transaction_type, balance_id, amount, to_balance_id); // Ensure this is valid
      res.sendStatus(204);
  } catch (error) {
      console.error("Error inserting transaction:", error);
      res.status(500).json({ message: 'Error adding new transaction', error });
  }
});




app.put('/api/updateTransactions/:id', async (req, res) => {
  const transaction_id = req.params.id;
  const { transaction_name, transaction_type, amount, balance_id, to_balance_id } = req.body;

  console.log("Updating transaction:", { transaction_id, transaction_name, transaction_type, amount, balance_id, to_balance_id });

  if (!transaction_id || !transaction_name || !transaction_type || amount === undefined || !balance_id) {
    return res.status(400).json({ message: 'All fields are required for updating transaction.' });
  }

  try {
    // Update transaction in the database
    await updateTransaction(transaction_id, transaction_name, transaction_type, amount);

    // Update balances based on the updated transaction type
    await updateBalances(transaction_type, balance_id, amount, to_balance_id);

    res.sendStatus(204); // No content
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: 'Error updating transaction', error });
  }
});



app.listen(3001, () => console.log('Server running on port 3001'));
