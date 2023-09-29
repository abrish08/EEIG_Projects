const express = require('express');
const mysql = require('mysql');

const cors = require('cors')
const app = express();
app.use(cors());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('./Database/db.js'); // Adjust the path
app.use(express.json()); // Parses JSON request bodies
app.use(express.urlencoded({ extended: true }));
const userRoute = require('./Routes/User.js'); 
app.use('/user', userRoute);
const inventoryRoute = require('./Routes/Inventory.js'); 
app.use('/inventory', inventoryRoute);
const hrRoute = require('./Routes/Hr.js'); 
app.use('/hr', hrRoute);
const fleetRoute = require('./Routes/Fleet.js'); 
app.use('/fleet', fleetRoute);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
  