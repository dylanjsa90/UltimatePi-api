'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let userSchema = mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  // remotes: [] or devices: []
  role: {type: String, default: 'adult'}
});

userSchema.methods.generateToken = function() {
  return jwt.sign({idd: this.username}, process.env.APP_SECRET);
};

userSchema.methods.generateHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, data) => {
      if (err) return reject(err);
      this.password = data;
      resolve({token: this.generateToken()});
    });
  });
};

userSchema.methods.comparePassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, data) => {
      if (err) return reject(err);
      if (!data) return reject(new Error('Invalid username or password'));
      // resolve() 
    });
  });
};

module.exports = mongoose.model('User', userSchema);