'use strict';

const mongoose = require('mongoose');
const serverError = require ('debug')('ultPie_api:test_error');
mongoose.connect('mongodb://localhost/routes_tests');
let app = require('express')();
const authRoute = require('../routes/auth-router');
const remoteRoute = require('../routes/remote-router');
// const userRoute = require('../routes/user-router');

// app.use('/api/', userRoute);
app.use('/api/', remoteRoute);
app.use('/api/', authRoute);

app.use((err, req, res, next) =>{
  serverError(err);
  res.status(err.statusCode || 500).json(err.message);
  next();
});

module.exports = exports = app;
