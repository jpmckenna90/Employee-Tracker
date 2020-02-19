const inquirer = require("inquirer");
const mysql = require("mysql");

// List of possible initial choices
const choices = [
  "View all employees",
  "View all departments",
  "View all roles",
  "Update employee role"
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
const employeeArray = [];
const roleArray = [];

// Function to query database and gather all departments and add them to the departmentsArray.
getDepartments = () => {
  connection.query("SELECT * FROM department", function(err, result) {
    if (err) throw err;
    result.forEach(department => {
      if (!departmentsArray.includes(department.title)) {
        departmentsArray.push(department.title);
      }
    });
  });
};

getEmployees = () => {
  connection.query("SELECT * FROM employee", function(err, result) {
    if (err) throw err;
    result.forEach(employee => {
      if (!employeeArray.includes(employee.id)) {
        employeeArray.push({
          name: employee.first_name + " " + employee.last_name,
          id: employee.id,
          role: employee.role_id,
          manager: employee.manager_id
        });
      }
    });
  });
};

// TODO getRoles();

getDepartments();
getEmployees();
// getRoles();

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
          viewAllDepartments();
          return;
        case choices[2]:
          viewAllRoles();
          return;
        case choices[3]:
          updateEmployee();
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
  });
  proceed("viewAll");
};

viewAllDepartments = () => {
  connection.query("SELECT * FROM department", function(err, res){
    if (err) throw err;
    console.log("Departments:")
    res.forEach(department => {
      console.log(department.title)
    })
    connection.end();
  })
}

viewAllRoles = () => {
  
}
// TODO Function to view all employees by department
// viewAllEmpByDept = () => {
//   inquirer
//     .prompt({
//       type: "list",
//       name: "action",
//       message: "Please choose a department.",
//       choices: departmentsArray
//     })
//     .then(function({ action }) {
//       connection.query(
//         "SELECT * FROM employee INNER JOIN department WHERE title LIKE ?",
//         action,
//         function(err, res) {
//           if (err) throw err;
//           res.forEach(employee => {
//             console.log(
//               employee.first_name +
//                 " | " +
//                 employee.last_name +
//                 " | " +
//                 employee.title
//             );
//           });
//         }
//       );

      // all employees of a certain department
      // console.log(action);
      // Some kind of join logic will probably
      // have to go here to pull all this data
      // together properly.
//       connection.end();
//       proceed("viewAllEmpByDept");
//     });
// };

// TODO Function to view all employees by manager
// viewAllEmpByManager = () => {
//   inquirer
//     .prompt({
//       type: "list",
//       name: "manager",
//       message: "Please select the manager's name.",
//       choices: employeeArray
//     })
//     .then(function({ manager }) {
//       console.log(manager.id);
      // connection.query("SELECT * FROM employee WHERE manager LIKE ?")
//     });
// };

// TODO function to add employee - can i use a constructor?
// addEmployee = () => {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         message: "Please enter the employee's first name.",
//         name: "employeeFirstName"
//       },
//       {
//         type: "input",
//         message: "Please enter the employee's last name.",
//         name: "employeeLastName"
//       },
//       {
//         type: "list",
//         message: "Please select the employee's role.",
//         name: "employeeRole",
//         choices: [1, 2, 3]
//       },
//       {
//         type: "list",
//         message: "Please select the employee's manager.",
//         name: "employeeManager",
//         choices: [1, 2, 3]
//       }
//     ])
    // currently the above successfully gets all information
//     .then(function({
//       employeeFirstName,
//       employeeLastName,
//       employeeRole,
//       employeeManager
//     }) {
//       connection.query(
//         "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
//         [employeeFirstName, employeeLastName, employeeRole, employeeManager],
//         function(err, res){
//           if (err) throw err;
//           connection.query("SELECT * FROM employee", function(err, result){
//             if (err) throw err;
//             console.log(result);
//           })
//         }
//       );
//     });
// };

// TODO Function to remove employee
// removeEmployee = () => {
//   inquirer.prompt({
//     type: "list",
//     name: "employee",
//     message: "Please select an employee to remove.",
//     choices: employeeArray
//   }).then(function(response){
//     console.log(response);
//   })
// }

proceed = fromState => {
  switch (fromState) {
    case "viewAll":
    case "viewAllEmpByDept":
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
