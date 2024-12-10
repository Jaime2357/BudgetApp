-- NOTE:
-- This could be used to initialize the database with some sample data, 
-- but it is recommended to use the website itself as we Hash the password for security reasons and direct insertion will result in passwords failing verification.

-- Insert data into Users table
INSERT INTO Users (username, password) VALUES
('user1', 'password123'),
('user2', 'securepass456'),
('testUser3', 'testpassword789'),
('demoUser4', 'demoPass123'),
('johnDoe', 'john123'),
('janeSmith', 'smithpass456'),
('aliceWonder', 'alice2023'),
('bobBuilder', 'builderSecure1'),
('chrisEvans', 'captainPassword'),
('tonyStark', 'ironManPass789'),
('bruceWayne', 'batPass123'),
('clarkKent', 'superMan456'),
('peterParker', 'spiderWeb321'),
('natashaRoman', 'widowSecurePass'),
('steveRogers', 'americaStrongPass');

-- Insert data into Balances table
INSERT INTO Balances (user_id, balance_name, balance_type, amount) VALUES
(1, 'Main Wallet', 'wallet', 500.00),
(1, 'Credit Card', 'credit', 300.00),
(2, 'Savings Account', 'wallet', 1000.00),
(2, 'Emergency Fund', 'wallet', 1500.00),
(3, 'Business Account', 'wallet', 2000.00),
(3, 'Personal Credit', 'credit', 500.00),
(4, 'Travel Fund', 'wallet', 1200.00),
(5, 'Daily Expenses', 'wallet', 800.00),
(5, 'Rewards Credit', 'credit', 400.00),
(6, 'Gift Savings', 'wallet', 100.00),
(7, 'Study Account', 'wallet', 700.00),
(8, 'Car Savings', 'wallet', 3000.00),
(9, 'Health Savings', 'wallet', 1500.00),
(10, 'Vacation Fund', 'wallet', 2500.00),
(11, 'Shopping Budget', 'wallet', 600.00);

-- Insert data into Transactions table
INSERT INTO Transactions (user_id, balance_id, transaction_name, transaction_type, amount) VALUES
(1, 1, 'Groceries', 'spending', 50.00),
(1, 1, 'Salary', 'income', 1500.00),
(1, 2, 'Credit Payment', 'pay credit', 100.00),
(2, 3, 'Electric Bill', 'spending', 200.00),
(2, 3, 'Freelance Work', 'income', 500.00),
(2, 4, 'Rent Transfer', 'transfer', 1200.00),
(3, 5, 'Office Supplies', 'spending', 300.00),
(3, 6, 'Credit Purchase', 'spending', 150.00),
(4, 7, 'Travel Booking', 'spending', 600.00),
(5, 8, 'Gas Refill', 'spending', 70.00),
(5, 9, 'Credit Cashback', 'income', 30.00),
(6, 10, 'Gift Shopping', 'spending', 50.00),
(7, 11, 'Tuition Fees', 'spending', 400.00),
(8, 12, 'Car Service', 'spending', 250.00),
(9, 13, 'Insurances', 'spending', 200.00);

