'use strict';

const createError = require('http-errors');

module.exports = function handleError(err, req, res, next){
  if (err.status && err.name){
    res.status(err.status).send(err.name);
    next();
    return;
  }
  err = createError(500, err.message);
  res.status(err.status).send(err.name);
};
