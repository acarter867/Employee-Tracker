// Package imports 
const mysql = require('mysql2'),
inquirer = require('inquirer');
require('console.table');

// Establish connection to database with credentials
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3301,
    user: 'root',
    password: 'Cherry98?',
    database: 'employees_db'
});

connection.connect(error => {
    if(error){
        throw error;
    }
})