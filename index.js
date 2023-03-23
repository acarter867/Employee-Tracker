// Package imports 
const mysql = require('mysql2'),
inquirer = require('inquirer');
require('console.table');

// Establish connection credentials
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Cherry98?',
    database: 'employees_db'
});

// Attempt connection
connection.connect(error => {
    if(error){
        throw error;
    }else{
        console.log("connection succsessful")
    }
    init();
});

//Initialize app & prompt user for questions
function init() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update employee role",
          "Exit"
        ]
      })
    .then(data => {
        switch(data.action){
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update employee role":
                updateRole();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                console.log("SOMETHING HAS GONE HORRIBLY WRONG, HAAAAAAALP");
                break;
        }
    })
    }

// Query departments
function viewDepartments() {
    connection.query('SELECT * FROM department', (err, res) => {
        if(err) console.log(err);
        console.table(res);
        init();
    })
};

// Query for viewing all roles
function viewRoles() {
    connection.query(`SELECT role.id, role.title, department.name AS department, role.salary
                FROM role, department
                WHERE role.department_id = department.id`, (err, res) => {
                    if(err) console.log(err);
                    console.table(res)
                    init();
    })
};

// Query to view all employees
function viewEmployees() {
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id
    FROM employee, role, department    
    WHERE employee.role_id = role.id and role.department_id = department.id;`, (err, res) => {
        if(err) console.log(err);
        console.table(res);
        init();
    })
};


// add department to database
function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What is the name of the new department?",
          })
        .then(function(answer) {
        var query = "INSERT INTO department (name) VALUES ( ? )";
        connection.query(query, answer.department, function(err, res) {
            console.log(`You have added this department: ${(answer.department).toUpperCase()}.`)
        })
        viewDepartments();
        })
}

// Add new role to db
function addRole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw (err);
    inquirer
        .prompt([{
            name: "title",
            type: "input",
            message: "What is the title of the new role?",
          }, 
          {
            name: "salary",
            type: "input",
            message: "What is the salary of the new role?",
          },
          {
            name: "departmentName",
            type: "list",
            message: "Which department does this role fall under?",
            choices: function() {
                var choicesArray = [];
                res.forEach(res => {
                    choicesArray.push(
                        res.name
                    );
                })
                return choicesArray;
              }
          }
          ]) 
        .then((answer) => {
        const department = answer.departmentName;
        connection.query('SELECT * FROM DEPARTMENT', function(err, res) {        
            if (err) throw (err);
            let filteredDept = res.filter(function(res) {
            return res.name == department;
        }
        )
        let id = filteredDept[0].id;
       let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
       let values = [answer.title, parseInt(answer.salary), id]
       console.log(values);
        connection.query(query, values,
            function(err, res, fields) {
            console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
        })
            viewRoles()
            })
        }) 
    })
}

async function addEmployee() {
    connection.query('SELECT * FROM role', function(err, result) {
        if (err) throw (err);
    inquirer
        .prompt([{
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
          }, 
          {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "roleName",
            type: "list",
            message: "What role does the employee have?",
            choices: function() {
             rolesArray = [];
                result.forEach(result => {
                    rolesArray.push(
                        result.title
                    );
                })
                return rolesArray;
              }
          }
          ]) 
// in order to get the id here, i need a way to grab it from the departments table 
        .then((answer) => {
        console.log(answer);
        const role = answer.roleName;
        connection.query('SELECT * FROM role', function(err, res) {
            if (err) throw (err);
            let filteredRole = res.filter(function(res) {
                return res.title == role;
            })
        let roleId = filteredRole[0].id;
        connection.query("SELECT * FROM employee", function(err, res) {
                inquirer
                .prompt ([
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is your manager?",
                        choices: function() {
                            managersArray = []
                            res.forEach(result => {
                                managersArray.push(
                                    `${result.first_name} ${result.last_name}`
                                )                                
                            })
                            return managersArray;
                        }
                    }
                ]).then((managerAnswer) => {
                    const manager = managerAnswer.manager;
                    connection.query('SELECT * FROM employee', function(err, res) {
                        if (err) throw (err);
                        let filteredManager = res.filter(function(res) {
                           return res.last_name == manager;
                        })
                        let managerId = filteredManager[0].id;
                        console.log(managerAnswer);
                        let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                        let values = [answer.firstName, answer.lastName, roleId, managerId]
                        console.log(values);
                        connection.query(query, values, (err, res, fields) => {
                             console.log(`You have added this employee: ${(values[0]).toUpperCase()}.`)
                        })
                        viewEmployees();
                        })
                     })
                })
            })
        })
})
}

// Update role
function updateRole() {
    connection.query('SELECT * FROM employee', (err, result) => {
        if (err) throw (err);
    inquirer
        .prompt([
          {
            name: "employeeName",
            type: "list",
            message: "Which employee's role is changing?",
            choices: () => {
             employeeArray = [];
                result.forEach(result => {
                    employeeArray.push(
                        `${result.first_name} ${result.last_name}`
                    );
                })
                return employeeArray;
              }
          }
          ])
        .then((response) => {
            const empName = response.employeeName;
            connection.query("SELECT title, id FROM role;", (err, result) => {
                console.log(result)
                inquirer
                .prompt([
                    {
                        name: "newRole",
                        type: "list",
                        message: `Select new role for ${empName}`,
                        choices: () => {
                            rolesArray = [];
                            result.forEach(result => {
                                rolesArray.push(`${result.title} - ${result.id}`);
                            })
                            return rolesArray;
                        }
                    }
                ])
                .then((response) => {
                    console.log(response)
                    const role_id = response.newRole.split(" ");
                    const newRole = role_id[0];
                    const newRoleId = role_id[role_id.length - 1];
                    const first_lastName = empName.split(" ");
                    const firstName = first_lastName[0];
                    const lastName = first_lastName[1];

                    console.log(`First Name = ${firstName} \n Last Name = ${lastName}
                    New Role Id: ${newRoleId}`)
                    connection.query(`UPDATE employee SET role_id = ${Number(newRoleId)}
                    WHERE first_name = "${firstName}" AND last_name = "${lastName}"`);
                    console.log(`${empName}'s role has been updated to ${response.newRole}`);
                    viewEmployees();
                })
            });
        })  
    })

}