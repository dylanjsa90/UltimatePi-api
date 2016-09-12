'use strict';

// npm modules
const jwt = require('jsonwebtoken');
const assert = require('assert');
const createError = require('http-errors');

// app modules
const User = require('../model/user');

module.exports = exports = function(req, res, next) {
  new Promise((resolve, reject) => {
    let authheader = req.headers.authorization;
    assert(typeof authheader === 'string', 'No auth token provided');
    authheader = authheader.split(' ');
    assert(authheader[0] === 'Bearer', 'No auth token provided');
    let decoded = jwt.verify(authheader[1], process.env.APP_SECRET);
    assert(decoded, 'Invalid Token');
    User.findOne({'username': decoded.idd})
      .then((user) => {
        assert(user !== null, 'Could not find user');
        req.user = user;
        next();
        resolve(user);
      }, reject);
  }).catch(next(createError(401, 'Unauthorized')));
};
