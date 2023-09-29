const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'eeig',
  password: '@construction$eeig',
  database: 'construction',
});

connection.connect((error) => {
  if (error) {
    console.error('Database connection failed: ', error);
  } else {
    console.log('Connected to the database');
  }
});

module.exports = connection;
