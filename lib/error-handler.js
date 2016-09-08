'use strict';

const appError = require('./app-error');

module.exports = exports = function() {
  return (req, res, next) => {
    res.sendError = function(err) {
      if (appError.isAppError(err)) return res.status(err.statusCode).send(err.message);
      res.status(500).send('Server Error');
    };
    next();
  };
};