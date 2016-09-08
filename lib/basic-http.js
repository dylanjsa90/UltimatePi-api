'use strict';

module.exports = exports = function(req, res, next) {
  try {
    let basicString= req.headers.authorization.split(' ')[1];
    let authBuffer = new Buffer(basicString, 'base64');
    let authArray = authBuffer.toString().split(':');
    req.auth = {
      username: authArray[0],
      password: authArray[1]
    };
    authBuffer.fill(0);
    next();
  } catch (e) {
    e.statusCode = 400;
    e.message = 'invalid BasicHTTP authentication';
    next();
  }
};