-- NOTE:
-- This could be used to initialize the database with some sample data, 
-- but it is recommended to use the website itself as we Hash the password for security reasons and direct insertion will result in passwords failing verification.

-- Insert data into Users table
INSERT INTO Users (user_id, username, password) VALUES
(1, 'user1', 'password123'),
(2, 'user2', 'securepass456'),
(3, 'testUser3', 'testpassword789'),
(4, 'demoUser4', 'demoPass123'),
(5, 'johnDoe', 'john123'),
(6, 'janeSmith', 'smithpass456'),
(7, 'aliceWonder', 'alice2023'),
(8, 'bobBuilder', 'builderSecure1'),
(9, 'chrisEvans', 'captainPassword'),
(10, 'tonyStark', 'ironManPass789'),
(11, 'bruceWayne', 'batPass123'),
(12, 'clarkKent', 'superMan456'),
(13, 'peterParker', 'spiderWeb321'),
(14, 'natashaRoman', 'widowSecurePass'),
(15, 'steveRogers', 'americaStrongPass');

-- Insert data into Balances table
INSERT INTO Balances (balance_id, user_id, balance_name, balance_type, amount) VALUES
(1, 1, 'Main Wallet', 'wallet', 500.00),
(2, 1, 'Credit Card', 'credit', 300.00),
(3, 2, 'Savings Account', 'wallet', 1000.00),
(4, 2, 'Emergency Fund', 'wallet', 1500.00),
(5, 3, 'Business Account', 'wallet', 2000.00),
(6, 3, 'Personal Credit', 'credit', 500.00),
(7, 4, 'Travel Fund', 'wallet', 1200.00),
(8, 5, 'Daily Expenses', 'wallet', 800.00),
(9, 5, 'Rewards Credit', 'credit', 400.00),
(10, 6, 'Gift Savings', 'wallet', 100.00),
(11, 7, 'Study Account', 'wallet', 700.00),
(12, 8, 'Car Savings', 'wallet', 3000.00),
(13, 9, 'Health Savings', 'wallet', 1500.00),
(14, 10, 'Vacation Fund', 'wallet', 2500.00),
(15, 11, 'Shopping Budget', 'wallet', 600.00);

-- Insert data into Transactions table
INSERT INTO Transactions (transaction_id, user_id, balance_id, transaction_name, transaction_type, amount, transaction_date, transaction_time) VALUES
(1, 1, 1, 'Groceries', 'spending', 50.00, '2024-01-01', '09:00:00'),
(2, 1, 1, 'Salary', 'income', 1500.00, '2024-01-02', '10:00:00'),
(3, 1, 2, 'Credit Payment', 'pay credit', 100.00, '2024-01-03', '11:00:00'),
(4, 2, 3, 'Electric Bill', 'spending', 200.00, '2024-01-04', '08:30:00'),
(5, 2, 3, 'Freelance Work', 'income', 500.00, '2024-01-05', '14:00:00'),
(6, 2, 4, 'Rent Transfer', 'transfer', 1200.00, '2024-01-06', '15:00:00'),
(7, 3, 5, 'Office Supplies', 'spending', 300.00, '2024-01-07', '16:00:00'),
(8, 3, 6, 'Credit Purchase', 'spending', 150.00, '2024-01-08', '12:00:00'),
(9, 4, 7, 'Travel Booking', 'spending', 600.00, '2024-01-09', '17:30:00'),
(10, 5, 8, 'Gas Refill', 'spending', 70.00, '2024-01-10', '13:00:00'),
(11, 5, 9, 'Credit Cashback', 'income', 30.00, '2024-01-11', '14:30:00'),
(12, 6, 10, 'Gift Shopping', 'spending', 50.00, '2024-01-12', '10:00:00'),
(13, 7, 11, 'Tuition Fees', 'spending', 400.00, '2024-01-13', '11:00:00'),
(14, 8, 12, 'Car Service', 'spending', 250.00, '2024-01-14', '15:00:00'),
(15, 9, 13, 'Insurances', 'spending', 200.00, '2024-01-15', '09:00:00');

