const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql=require('mysql');
const connection = require('../Database/db.js');

router.get('/items/:category', (req, res) => {
    const category = req.params.category;
  
    connection.query(
      'SELECT * FROM inventory WHERE category = ?',
      category,
      (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Error fetching items by category' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  router.put('/updateItem/:serial_number', (req, res) => {
    const serialNumber = req.params.serial_number;
    const updatedData = req.body; // This should contain the updated data from the client
  
    // Update the data in the database
    connection.query(
      'UPDATE inventory SET ? WHERE serial_number = ?',
      [updatedData, serialNumber],
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
  router.post('/insertData', (req, res) => {
    const {
      category,
      user,
      model,
      serial_number,
      quantity,
      user_dept,
      user_position,
      issue_date,
      remark,
      location,
      status,
      customCategory, // Add customCategory here
    } = req.body;
  
    // If category is 'Other', use the customCategory from the request body, otherwise use the selected category
    const finalCategory = category === 'Other' ? customCategory : category;
  
    // Insert the data into the SQL database
    const query =
      'INSERT INTO inventory (category,user,model,serial_number,quantity,user_dept,user_position,issue_date,remark, location,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
  
    connection.query(
      query,
      [
        finalCategory,
        user,
        model,
        serial_number,
        quantity,
        user_dept,
        user_position,
        issue_date,
        remark,
        location,
        status,
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
  router.get('/categories', (req, res) => {
    const query = 'SELECT DISTINCT category FROM inventory';
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching categories: ', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        const categories = results.map((result) => result.category);
        res.json(categories);
      }
    });
  });
  router.get('/categoryData/:category', (req, res) => {
    const { category } = req.params;
  
    connection.query(
      'SELECT * FROM inventory WHERE category = ?',
      [category],
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
  router.get('/laptopData/:serial_number', (req, res) => {
    const { serial_number } = req.params;
  
    connection.query(
      'SELECT * FROM inventory WHERE serial_number = ?',
      [serial_number],
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
  router.delete('/deletitem/:serial_number', (req, res) => {
    const serial_number = req.params.serial_number;
    const sql = 'DELETE FROM inventory WHERE serial_number=?';
    connection.query(sql, [serial_number], (err, result) => {
      if (err)
        res.status(500).json({ error: 'An internal server error occurred' });
      return res.json(result);
    });
  });
 module.exports=router;