
const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql=require('mysql');
const connection = require('../Database/db.js');

router.post('/insertData', (req, res) => {
  const {
    department,
    firstname,
    lastname,
    employee_id,
    job_position,
  
    hire_date,
    level,
    location,
    remark,
    customdepartment, // Add customdepartment here
  } = req.body;

  // If department is 'Other', use the customdepartment from the request body, otherwise use the selected department
  const finaldepartment = department === 'Other' ? customdepartment : department;

  // Insert the data into the SQL database
  const query =
    'INSERT INTO employee (department,firstname,lastname,employee_id,job_position,hire_date,level, location,remark) VALUES (?,?,?,?,?,?,?,?,?)';

  connection.query(
    query,
    [
      finaldepartment,
      firstname,
      lastname,
      employee_id,
      job_position,
    
      hire_date,
      level,
      location,
      remark,
    ],
    (error, results) => {
      if (error) {
        console.error('Error inserting data: ', error);
        res.status(500).json({ message: 'An error occurred' });
      } else {
        res.json({ message: 'Data inserted successfully' });
      }
    }
  );
});
  router.get('/employeeUpdate/:id', (req, res) => {
    const { id } = req.params;
    connection.query(
      'SELECT * FROM employee WHERE id = ?',
      [id],
      (error, results) => {
        if (error) {
          console.error('Error fetching data:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: 'Laptop not found' });
        }
  
        const laptop = results[0];
        res.json(laptop);
      }
    );
  });
  router.put('/updateEmployee/:id', (req, res) => {
    const id = req.params.id;
    const updatedData = req.body; // This should contain the updated data from the client
  
    // Update the data in the database
    connection.query(
      'UPDATE employee SET ? WHERE id = ?',
      [updatedData, id],
      (err, result) => {
        if (err) {
          console.error('Error updating data:', err);
          res
            .status(500)
            .json({ error: 'An error occurred while updating data' });
        } else {
          console.log('Data updated successfully');
          res.status(200).json({ message: 'Data updated successfully' });
        }
      }
    );
  });
  router.delete('/deleteEmployee/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM employee WHERE id=?';
    connection.query(sql, [id], (err, result) => {
      if (err)
        res.status(500).json({ error: 'An internal server error occurred' });
      return res.json(result);
    });
  });
  module.exports=router