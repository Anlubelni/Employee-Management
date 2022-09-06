<h1 align="center">EM9001 System, an Employee Managment System</h1>

## Description
The EM9001 System is an employee management system used to perform CRUD operations on a database based on inputs to prompts in a text based console.


## Installation Instructions
In order to be able to run this project, you must have the following installed:
- mySQL
- mySQL Workbench
- Node Package Manager (npm)

Once those are installed you must set up your database
1. Set up your project by opening the terminal and running 'npm install' at the root of the project files.
2. Open the terminal and make sure mySQL server is started by running the following command
     'sudo /usr/local/mysql/bin/mysqld_safe'
3. Open mySQL Workbench and create a new connection, taking note of the name of the connection you set and the username and password you have selected.
4. Duplicate the .env.sample and rename it to .env
5. Populate the .env file with the values you established when creating your new database schema (connection name, username, password).
6. Navigate to the db folder and open the schema.sql file and paste the contents into mySQL Workbench to generate the database.
7. In the terminal, run 'npm run seed' at the root of the project files to generate database data.


 
## Usage Information
Open up the terminal and navigate to the root of your project files and type 'node ./index.js' to start the application.
Use the arrow keys to select an option, and follow the prompts from there!
A video for using the project can be found [here](TODO ADD URL TO VIDEO).
