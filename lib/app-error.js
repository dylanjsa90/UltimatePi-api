'use strict';
// Unused as of recent changes
let appError = module.exports = exports = function(msg, statusCode, response) {
  this.message = msg;
  this.statusCode = statusCode;
  this.responseMessage = response;
};

appError.error = function(msg, status) {
  let statusCode = status || 500;
  let message;
  if (statusCode < 500) message = 'Bad request';
  return new appError(msg, statusCode, message || 'Server Error'); 
};

appError.isAppError = function(err) {
  return err instanceof appError;
};