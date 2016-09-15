'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const Remote = require('./remote');

let userSchema = mongoose.Schema({
  username: {type: String, unique: true, required: [true, 'no username']},
  password: {type: String, required: true},
  remotes: [{type: mongoose.Schema.Types.ObjectId,  ref: 'Remote', unique: true}],
  role: {type: String, default: 'basic'}
}, {minimize: false});

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
      console.log('entered compare password');
      // if (err || data === false) return reject(createError(401, 'Bad login info.'));
      if (data === false){
        console.log('I entered this wrong password error');
        return reject(createError(401, 'Invalid username or password'));
      }
      resolve({token: this.generateToken()});
    });
  });
};


userSchema.methods.addRemote = function(data) {
  let result;
  return new Promise((resolve, reject) => {
    if (!data.name || !data.controls || !data.userId) return reject(createError(400, 'Required info missing'));
    (new Remote(data)).save().then(remote => {
      result = remote;
      this.remotes.push(remote._id);
      this.save();
      resolve(result);
    }, createError(404, 'Not found'));
  });
};

userSchema.methods.removeRemote = function(remoteId) {
  return new Promise((resolve, reject) => {
    this.remotes.filter(value => {
      if (value === remoteId) return false;
      return true;
    });
    this.save().then(() => {
      return Remote.findByIdAndRemove(remoteId);
    })
    .then(remote => resolve(remote)).catch(reject);
  });
};

module.exports = mongoose.model('User', userSchema);
