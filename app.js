'use strict';

const createError = require('http-errors');

const socket = require('socket.io-client')('https://ultimate-pi-backend.herokuapp.com');
const exec = require('child_process').exec;
const lirc = require('lirc_node');
lirc.init();

console.log('app.js up and running');
socket.on('post', (data) => {
  console.log('sending command: ' + data);
  exec('irsend SEND_ONCE Vizio KEY_' + data, (err, stdout, stderr) => {
    console.log('irsend SEND_ONCE Vizio KEY_' + data);
    if (err) return createError(err);
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
  });
});
