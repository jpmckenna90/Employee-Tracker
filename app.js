const inquirer = require("inquirer");
const mysql = require("mysql");

// List of possible initial choices
const choices = ["View all employees", 
                 "View all employees by department", 
                 "View all employees by Manager",
                 "Add Employee",
                 "Remove Employee",
                 "Update Employee", 
                 "Update Employee Manager"];

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


promptUser = () => {
  inquirer.prompt([{ 
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: choices
 }]).then(function({action}){
   switch(action){
     case choices[0]:
       console.log(choices[0]);
       return;
      case choices[1]:
        console.log(choices[1])
        return;
      case choices[2]:
        console.log(choices[2]);
        return;
      case choices[3]:
        console.log(choices[3]);
        return;
      case choices[4]:
        console.log(choices[4]);
        return;
      case choices[5]:
        console.log(choices[5]);
        return;
      case choices[6]:
        console.log(choices[6]);
        return;
      default:
        console.log("Please choose a valid option.");
        promptUser();
   }
  //  console.log(action);
    // return {action};
 });
};


begin = () => {
  promptUser();
  // const choice = promptUser();
  // console.log(choice);
  // switch(promptUser()){
  //   case "View all employees":
  //     console.log('yep');
  // }
}

begin();
