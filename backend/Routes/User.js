const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql=require('mysql');
const connection = require('../Database/db.js');
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
  
    try {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 25); // 10 is the number of salt rounds
      const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      connection.query(sql, [username, hashedPassword, role], (err, result) => {
        if (err) {
          console.error('Error storing data in the database: ', err);
          res.status(500).json({ error: 'An error occurred while registering.' });
          return;
        }
  
        console.log('Registered successfully');
        res.json({ message: 'Registration successful.' });
      });
    } catch (error) {
      console.error('Error hashing data:', error);
      res.status(500).json({ error: 'An error occurred while registering.' });
    }
  });
  
  router.post('/login', (req, res) => {
    const { password } = req.body;
    const username = req.body.username;
    const sql = 'SELECT * FROM users WHERE username = ?';
    connection.query(sql, [username], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const user = results[0];
      try {
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (passwordMatch) {
          const token = jwt.sign(
            { username: user.username, role: user.role },
            'eeig@construction'
          );
          return res.status(200).json({ token, role: user.role });
        } else {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      } catch (error) {
        console.error('Error comparing passwords:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  });
  
  router.get('/userManager', (req, res) => {
    const query = 'SELECT *FROM users';
  
    connection.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    console.log('Received token:', token);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, 'eeig@construction', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  }
  function authorize(role) {
    return (req, res, next) => {
      const userRole = req.user.role;
      if (userRole !== role) {
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    };
  }
  router.get('/admin', authenticateToken, authorize('admin'), (req, res) => {});
  router.get(
    '/it_admin',
    authenticateToken,
    authorize('it_admin'),
    (req, res) => {}
  );
  router.get('/fleet', authenticateToken, authorize('fleet'), (req, res) => {});
  router.get('/inventory', authenticateToken, authorize('inventory'), (req, res) => {});
  router.get('/hr', authenticateToken, authorize('hr'), (req, res) => {});
  router.get(
    '/fleetadmin',
    authenticateToken,
    authorize('fleetadmin'),
    (req, res) => {}
  );
  module.exports=router;