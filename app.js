const inquirer = require("inquirer");
const mysql = require("mysql");

// List of possible initial choices
const choices = [
  "View all employees",
  "View all employees by department",
  "View all employees by Manager",
  "Add Employee",
  "Remove Employee",
  "Update Employee",
  "Update Employee Manager"
];

// Create connection to database
const connection = mysql.createConnection({
  // First, identify host
  host: "localhost",

  // Next, identify port
  port: 3306,

  // Next, credentials
  user: "root",
  password: "rootroot",

  // Provide database name
  database: "employeetracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  begin();
});

const departmentsArray = [];

// Function to query database and gather all departments and add them to the departmentsArray. 
getDepartments = () => {
  connection.query("SELECT * FROM department", function(err, result) {
    if (err) throw err;
    result.forEach(department => {
      if (!departmentsArray.includes(department.title)) {
        departmentsArray.push(department.title);
      }
    });
    console.log(departmentsArray);
  });
};

getDepartments();

promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: choices
      }
    ])
    .then(function({ action }) {
      switch (action) {
        case choices[0]:
          viewAllEmployees();
          return;
        case choices[1]:
          viewAllEmpByDept();
          return;
        case choices[2]:
          viewAllEmpByManager();
          return;
        case choices[3]:
          addEmployee();
          return;
        case choices[4]:
          removeEmployee();
          return;
        case choices[5]:
          updateEmployee();
          return;
        case choices[6]:
          updateEmployeeManager();
          return;
        default:
          console.log("Please choose a valid option.");
          promptUser();
      }
    });
};

begin = () => {
  promptUser();
};

viewAllEmployees = () => {
  connection.query("SELECT * FROM employee", function(err, res) {
    if (err) throw err;
    res.forEach(employee => {
      console.log(employee.first_name + " " + employee.last_name);
    });
    connection.end();
  });
  proceed("viewAll");
};

viewAllEmpByDept = () => {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "Please choose a department.",
      choices: departmentsArray
    })
    .then(function() {
      console.log("hello");
      // res.forEach(employee => {
      //   console.log(
      //     employee.first_name + " " + employee.last_name + " , " + department
      //   );
      // });
    });
  connection.end();
};

proceed = fromState => {
  switch (fromState) {
    case "viewAll":
      inquirer
        .prompt({
          type: "list",
          name: "action",
          question: "What would you like to do?",
          choices: ["Main Menu", "Exit"]
        })
        .then(function({ action }) {
          switch (action) {
            case "Main Menu":
              begin();
              return;
            case "Exit":
              console.log("Exiting...");
              return;
          }
        });
  }
};
