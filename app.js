const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  console.log('Connected to database '+ config.database);
});

mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err);
});

const app = express();

const users = require('./routes/users')

// port number
const port = 3000;

// Enabling CORS
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Enable BodyParser for form submittion
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//User Route
app.use('/users', users);

//home route
app.get('/', (req, res) => {
  res.send('Home Page');
});

//Start server
app.listen(port, () => {
  console.log('Server started on port '+port);
});