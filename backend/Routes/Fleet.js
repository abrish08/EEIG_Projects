const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql=require('mysql');
const connection = require('../Database/db.js');


router.post('/fleetData', (req, res) => {
    const {
      firstname,
      lastname,
      user_id,
      user_position, // This should be user_position
      department,
      issue_date, // This should be issue_date
      current_address,
      destination,
    } = req.body.values;
  
    // Insert the data into the SQL database
    const query =
      'INSERT INTO fleetreq (firstname,lastname,user_id,department,user_position,issue_date,current_address, destination) VALUES (?,?,?,?,?,?,?,?)';
    connection.query(
      query,
      [
        firstname,
        lastname,
        user_id,
        department,
        user_position, // Corrected order
        issue_date, // Corrected order
        current_address,
        destination,
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
  router.get('/fleetData/:user_id', (req, res) => {
    const { user_id } = req.params;
  
    connection.query(
      'SELECT * FROM fleetreq WHERE user_id = ?',
      [user_id],
      (error, results) => {
        if (error) {
          console.error('Error fetching data:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'user  not found' });
        }
  
        const laptop = results[0];
        res.json(laptop);
      }
    );
  });
  router.delete('/deleteApproved/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    const sql = 'DELETE FROM fleetapprove WHERE user_id=?';
    connection.query(sql, [user_id], (err, result) => {
      if (err)
        res.status(500).json({ error: 'An internal server error occurred' });
      return res.json(result);
    });
  });
  router.delete('/deleterequest/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    const sql = 'DELETE FROM fleetreq WHERE user_id=?';
    connection.query(sql, [user_id], (err, result) => {
      if (err)
        res.status(500).json({ error: 'An internal server error occurred' });
      return res.json(result);
    });
  });
  router.get('/fleetcheck/:employeeId', (req, res) => {
    const employeeId = req.params.employeeId;
  
    const query = 'SELECT * FROM fleetapprove WHERE user_id = ?';
    connection.query(query, [employeeId], (error, result) => {
      if (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (result.length === 0) {
        return res.json(null); // Return null if employee not found
      }
  
      const employeeData = result[0];
      return res.json(employeeData);
    });
  });
  router.post('/api/users', (req, res) => {
    const {
      firstname,
      lastname,
      user_id,
      user_position,
      department,
      current_address,
      destination,
      issue_date,
      phone,
    } = req.body;
  
    const query =
      'INSERT INTO fleetreq (firstname, lastname, user_id, department,user_position, current_address,  destination, issue_date,phone) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)';
    connection.query(
      query,
      [
        firstname,
        lastname,
        user_id,
        user_position,
        department,
        current_address,
        destination,
        issue_date,
        phone,
      ],
      (error, results) => {
        if (error) {
          console.error('Error executing SQL query:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        return res.json({ message: 'Form data submitted successfully' });
      }
    );
  });
  router.post('/approveRequest', (req, res) => {
    const {
      firstname,
      lastname,
      department,
      user_position,
      current_address,
      destination,
      drivername,
      phone,
      approve_date,
      issue_date,
      user_id,
    } = req.body;
  
    const query =
      'INSERT INTO fleetapprove (firstname, lastname, department,user_position, current_address,  destination,drivername,  phone,approve_date,issue_date,  user_id) VALUES (?, ?, ?,?,?, ?, ?, ?, ?,?,?)';
    connection.query(
      query,
      [
        firstname,
        lastname,
        department,
        user_position,
        current_address,
        destination,
        drivername,
        phone,
        approve_date,
        issue_date,
        user_id,
      ],
      (error, results) => {
        if (error) {
          console.error('Error executing SQL query:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        return res.json({ message: 'Form data submitted successfully' });
      }
    );
  });
  module.exports=router