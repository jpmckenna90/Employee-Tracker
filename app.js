const inquirer = require("inquirer");
const mysql = require("mysql");
const { table } = require("table");

// List of possible initial choices
const choices = [
  "View all employees",
  "View all departments",
  "View all roles",
  "Add employee",
  "Add department",
  "Add role",
  "Update employee"
];

const config = {
  singleLine: true
};

// Create connection to database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
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

getRoles = () => {
  connection.query("SELECT * FROM role", function(err, result) {
    if (err) throw err;
    result.forEach(role => {
      if (!roleArray.includes(role.id)) {
        roleArray.push(role.title);
      }
    });
  });
};

getDepartments();
getEmployees();
getRoles();

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
          addEmployee();
          return;
        case choices[4]:
          addDepartment();
          return;
        case choices[5]:
          addRole();
          return;
        case choices[6]:
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
    tableData = [];
    res.forEach(employee => {
      tableData.push([
        employee.id,
        employee.first_name + " " + employee.last_name
      ]);
    });
    output = table(tableData, config);
    console.log(output);
    connection.end();
  });
  proceed("viewAll");
};

viewAllDepartments = () => {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
    tableData = [];
    res.forEach(department => {
      tableData.push([department.title]);
    });
    output = table(tableData, config);
    console.log(output);
    connection.end();
  });
  proceed("viewAll");
};

viewAllRoles = () => {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err;
    tableData = [];
    res.forEach(role => {
      tableData.push([role.id, role.title]);
    });
    output = table(tableData, config);
    console.log(output);
    connection.end();
  });
  proceed("viewAll");
};

updateEmployee = () => {
  inquirer
    .prompt({
      type: "list",
      name: "employee",
      message: "Please choose an employee to update.",
      choices: employeeArray
    })
    .then(function({ emp }) {
      employeeArray.forEach(employee => {
        console.log(employee);
      });
    });
};

addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter the employee's first name.",
        name: "employeeFirstName"
      },
      {
        type: "input",
        message: "Please enter the employee's last name.",
        name: "employeeLastName"
      },
      {
        type: "list",
        message: "Please select the employee's role.",
        name: "employeeRole",
        choices: roleArray
      },
      {
        type: "list",
        message: "Please select the employee's manager.",
        name: "employeeManager",
        choices: employeeArray
      }
    ])
    .then(function({
      employeeFirstName,
      employeeLastName,
      employeeRole,
      employeeManager
    }) {
      // Due to the way inquirer handles response objects, setting new variables to translate employeeRole and
      // employeeManager into their corresponding IDs.
      let roleId;
      let managerId;
      connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        res.forEach(role => {
          if (role.title === employeeRole) {
            roleId = role.id;
          }
        });
        connection.query("SELECT * FROM employee", function(err, res) {
          if (err) throw err;
          res.forEach(employee => {
            if (
              employee.first_name + " " + employee.last_name ===
              employeeManager
            ) {
              managerId = employee.id;
            }
          });
          connection.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
            [employeeFirstName, employeeLastName, roleId, managerId],
            function(err, res) {
              if (err) throw err;
            }
          );
        });
      });
    });
};

addDepartment = () => {
  inquirer.prompt([
    {
      type: "input",
      message: "Please enter the name of the department you wish to create.",
      name: "department"
    }
  ]).then(function(department){
    // console.log(department);
    connection.query("INSERT INTO department (title) VALUES ?;", JSON.stringify(department), function(err, res){
      if (err) throw err;
    })
    console.log("Department successfully added.");
    proceed("addDepartment");
  });
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
        return;
    case "addDepartment":
      inquirer.prompt({
        type: "list", 
        name: "action",
        question: "What would you like to do?",
        choices: ["Add another department", "Main Menu", "Exit"]
      }).then(function({action}){
        switch (action){
          case "Add another department":
            addDepartment();
            return;
          case "Main Menu":
            begin();
            return;
          case "Exit":
            console.log("Exiting...");
            return;
        }
      });
      return;
  }
};

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
