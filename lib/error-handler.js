'use strict';

const createError = require('http-errors');

module.exports = function handleError(err, req, res, next){
  console.log(req.statusCode);
  console.log(res.status);
  if (err.status && err.message){
    console.log(err.status);
    res.status(err.status).send(err.message);
    next();
    return;
  }
  err = createError(500,'is this the fucking error we keep getting?');
  res.status(err.status).send(err.name);
};
