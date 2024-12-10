Project Overview: This app is meant to track and manage personal budgets by storing balance and transaction data and automatically updating balances acccording to newly added transactions.

Setup and Run:
- Install postgresQL from https://postgresapp.com/ 
- Configure postgresQL settings to your liking
- Pull/Clone the github repository or unzip the folder
- Open ./server/index.js and modify lines 16 through 22 with your PostgresQL credentials and parameters
- If node_modules is not included or any related issues come up, run ```npm install``` (See Note 1 Below)
- Open a terminal in the root folder and run the command ```npm run dev```

Dependencies and Required Software:
- PostgresQL: https://postgresapp.com/ 
- JDK-11: https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html
- Documentation for the JDBC driver: https://github.com/jaynath-d/node-jdbc-driver?tab=readme-ov-file
    - JDBC Driver will be installed when running ```npm run dev```

Notes:
1. When running ```npm install``` use ```JAVA_HOME=<Path to jdk> npm install``` to ensure you're installing the JDBC driver with JDK 11 or another compatible version as JDBC only works with specific java versions and this is required to get the JDBC driver properly installed.