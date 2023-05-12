require('dotenv').config();
const express = require('express');
// const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

const app = express();

require('./data/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// const User = require('./models/user');

require('./controllers/cats')(app);
require('./controllers/auth')(app);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;