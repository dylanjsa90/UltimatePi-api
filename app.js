'use strict';

const socket = require('socket.io-client')(process.env.API_URL || 'http://localhost:3000');
const exec = require('child_process').exec;
const lirc = require('lirc_node');
lirc.init();


// data [0] remote data[1] button
socket.on('post', (data) => {
  console.log('post: ' + data);
  exec('irsend SEND_ONCE ' + data[0] + ' ' + data[1], (err, stdout, stderr) => {
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
  });
});