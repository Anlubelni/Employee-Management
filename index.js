require("dotenv").config();
const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");

// Create DB connection
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    multipleStatements: true,
  },
  console.log(`Connected to the employees_db database.`)
);

// Let's do the time warp again!
const restart = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "continue",
        message: "Do you want to do more things or...?",
      },
    ])
    .then((answer) => {
      if (answer.continue) {
        // Brings us back to the start
        startHere();
      } else {
        // Closes out
        console.log(
          "You have successfully exited the EM9001 System, now make like a tree and GET OUTTA HERE!"
        );
        process.exit(0);
      }
    });
};

// Starting point for all the questions
const startHere = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "Welcome to the EM9001 system. What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
          "quit",
        ],
      },
    ])
    .then((answer) => {
      console.log(answer);
      // Do work based on the option selected.
      if (answer.options === "view all departments") {
        // Shows the user all departments
        db.connect(function (err) {
          if (err) throw err;
          console.log("Here are the departments you were looking for, Chief!");
          db.query(`SELECT * FROM department`, function (err, result) {
            if (err) {
              console.log(
                "Something funky happened! Maybe it was our fault, maybe it was yours! Ask the person who programmed this to figure it out!"
              );
            } else {
              console.table(result);
            }
            // Back to the top
            restart();
          });
        });
      }
      if (answer.options === "view all roles") {
        // Shows the user all the roles
        db.connect(function (err) {
          if (err) throw err;
          console.log("Here are the roles you asked for, friend!");
          db.query(`SELECT * FROM role`, function (err, result) {
            if (err) {
              console.log(
                "Something funky happened! Maybe it was our fault, maybe it was yours! Ask the person who programmed this to figure it out!"
              );
            } else {
              console.table(result);
            }
            // Back to the top
            restart();
          });
        });
      }
      if (answer.options === "view all employees") {
        // Shows the user all the employeews
        db.connect(function (err) {
          if (err) throw err;
          console.log("Here are the employees you were searching for, pal!");
          db.query(`SELECT * FROM employee`, function (err, result) {
            if (err) {
              console.log(
                "Something funky happened! Maybe it was our fault, maybe it was yours! Ask the person who programmed this to figure it out!"
              );
            } else {
              console.table(result);
            }
            // Back to the top
            restart();
          });
        });
      }
      if (answer.options === "add a department") {
        addDepartment();
      }
      if (answer.options === "add a role") {
        addRole();
      }
      if (answer.options === "add an employee") {
        addEmployee();
      }
      if (answer.options === "update an employee role") {
        updateEmployeeRole();
      }
      if (answer.options === "quit") {
        console.log(
          "You have successfully exited the EM9001 System, now make like a tree and GET OUTTA HERE!"
        );
        process.exit(0);
      }
    });
};

// Adds a department to the department table
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "add_new_department",
        message: "What would you like to name this new department, buddy?",
      },
    ])
    .then((answer) => {
      console.log(answer);
      db.query(
        `INSERT INTO department (name) VALUES (?)`,
        [answer.add_new_department],
        function (err, result) {
          if (err) {
            console.log(
              "Something weird happened, so your submission wasnt saved. Did you put a wrong value your something there, my liege?"
            );
          } else {
            console.log(
              "Department successfully added! YEEEEAHHH BOIIIIIIIIIIIIII!"
            );
          }
          // Back to the top
          restart();
        }
      );
    });
};

// Adds a role to the role table
const addRole = () => {
  const departments = [];
  db.query(`SELECT name FROM department;`, function (err, department_results) {
    if (err) throw err;
    for (let i = 0; i < department_results.length; i++) {
      departments.push(department_results[i].name);
    }
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "add_new_role",
        message: "What would you like to name the new role, my dude?",
      },
      {
        type: "input",
        name: "add_salary_to_new_role",
        message: "What will be the salary of this new role, my dude?",
      },
      {
        type: "list",
        name: "add_new_role_to_department",
        message: "What department does the role belong to, my... guy?",
        choices: departments,
      },
    ])
    .then((answer) => {
      console.log(answer);
      db.query(
        `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
        [
          answer.add_new_role,
          answer.add_salary_to_new_role,
          departments.indexOf(answer.add_new_role_to_department) + 1,
        ],
        function (err, result) {
          if (err) {
            console.log(
              "Something weird happened, so your submission wasnt saved. Did you put a wrong value your something there, guy?"
            );
          } else {
            console.log("Role successfully added! Huzzah!");
          }
          // back to top
          restart();
        }
      );
    });
};

// Adds an employee to the employee table
const addEmployee = () => {
  const managers = [];
  const roles = [];
  // Obtains all roles available
  db.query(`SELECT title FROM role;`, function (err, roles_results) {
    if (err) throw err;
    for (let i = 0; i < roles_results.length; i++) {
      roles.push(roles_results[i].title);
    }
  });

  // Obtains all possible managers
  db.query(
    `SELECT first_name, last_name, id FROM employee;`,
    function (err, managers_results) {
      if (err) throw err;
      for (let j = 0; j < managers_results.length; j++) {
        // populating the array with the managers
        managers.push(
          managers_results[j].first_name +
            " " +
            managers_results[j].last_name +
            ", The employee's ID is:" +
            managers_results[j].id
        );
        // adding null to the list of choices for managers
        // manager_list.push('null');
      }
      // console.log('\n', manager_list);
    }
  );
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What's the new employees first name, sarge?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What's the new employees last name, captain?",
      },
      {
        type: "list",
        name: "add_role_to_new_employee",
        message: "What's the new employee's role, lietenant?",
        choices: roles,
      },
      {
        type: "list",
        name: "add_manager_to_new_employee",
        message: "Who is the new employee's manager, general?",
        choices: managers,
      },
    ])
    .then((answers) => {
      console.log(answers);
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
        [
          answers.first_name,
          answers.last_name,
          roles.indexOf(answers.add_role_to_new_employee) + 1,
          managers.indexOf(answers.add_manager_to_new_employee) + 1,
        ],
        function (err, result) {
          if (err) {
            console.log(
              "Something weird happened, so your submission wasnt saved. Did you put a wrong value your something there, guy?"
            );
          } else {
            console.log(
              `${answers.first_name} ${answers.last_name} was added as an employee! Congrats ${answers.first_name}!'`
            );
          }
          // back to the top
          restart();
        }
      );
    });
};

// Updates the role for a given employee
const updateEmployeeRole = () => {
  const employees = [];
  const roles = [];
  // Obtains all employees
  db.query(
    `SELECT first_name, last_name FROM employee;`,
    function (err, employee_results) {
      if (err) throw err;
      for (let k = 0; k < employee_results.length; k++) {
        employees.push(
          employee_results[k].first_name + " " + employee_results[k].last_name
        );
      }

      // Obtains all roles
      db.query(`SELECT title FROM role;`, function (err, roles_results) {
        if (err) throw err;
        for (let i = 0; i < roles_results.length; i++) {
          roles.push(roles_results[i].title);
        }
        inquirer
          .prompt([
            {
              type: "list",
              name: "target_employee",
              message: "Which employee is getting promoted?? Or demoted? :(",
              choices: employees,
            },
            {
              type: "list",
              name: "target_role",
              message: "What role is the employee gonna get, dude?",
              choices: roles,
            },
          ])
          .then((answers) => {
            console.log(answers);
            db.query(
              `UPDATE employee SET role_id=? WHERE id=?`,
              [
                roles.indexOf(answers.target_role) + 1,
                employees.indexOf(answers.target_employee) + 1,
              ],
              function (err, result) {
                if (err) {
                  console.log(
                    "Something weird happened, so your submission wasnt saved. Did you put a wrong value your something there, guy?"
                  );
                } else {
                  console.log(
                    `${answers.target_employee} was promoted (or demoted) to ${answers.target_role}!'`
                  );
                }
                // back to the top
                restart();
              }
            );
          });
      });
    }
  );
};

// Let's get it started in here!
startHere();
