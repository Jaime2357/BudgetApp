-- Create the Users table
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE
);

-- Create the Balances table
CREATE TABLE IF NOT EXISTS Balances (
    balance_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    balance_name VARCHAR(20) NOT NULL UNIQUE,
    balance_type VARCHAR(20) NOT NULL CHECK (balance_type IN ('wallet', 'credit')),
    amount DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create the Transactions table
CREATE TABLE IF NOT EXISTS Transactions (
    transaction_id SERIAL PRIMARY KEY,
    balance_id INT NOT NULL,
    user_id INT NOT NULL,
    transaction_name VARCHAR(20) NOT NULL UNIQUE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('spending', 'income', 'transfer', 'pay credit')),
    amount DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    transaction_date DATE DEFAULT CURRENT_DATE,
    transaction_time TIME DEFAULT CURRENT_TIME,
    FOREIGN KEY (balance_id) REFERENCES Balances(balance_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
