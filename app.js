'use strict';

const createError = require('http-errors');

const socket = require('socket.io-client')('https://ultimate-pi-backend.herokuapp.com');
const exec = require('child_process').exec;
const lirc = require('lirc_node');
lirc.init();

socket.on('error', (error) => {
  console.log('socket error: ' + error);
});

console.log('app.js up and running');
socket.on('post', (data) => {
  console.log('post: ' + data);
  exec('irsend SEND_ONCE VIZIO KEY_' + data[0], (err, stdout, stderr) => {
    if (err) return createError(err);
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
  });
});
