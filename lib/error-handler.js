'use strict';

const createError = require('http-errors');

module.exports = function handleError(err, req, res, next) {
  if (err.status && err.name) {
    console.log('Error handled by Error Handler.');
    next(err.status, err.name);
  }
  else {
    err = createError(500, 'Internal server error.');
    res.status(err.status).send(err.name);
  }
};
