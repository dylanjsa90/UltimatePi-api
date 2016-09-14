'use strict';

const app = require('express')();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./lib/error-handler');
const Promise = require('./lib/promise');
const createError = require('http-errors');
mongoose.promise = Promise;

const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;
const dbPort = process.env.MONGODB_URI || 'mongodb://localhost/deploy';
mongoose.connect(dbPort);

// const remoteRouter = require('./routes/remote-router');
const userRouter = require('./routes/user-router');
const authRouter = require('./routes/auth-router');

app.use(morgan('dev'));
app.use(cors());

app.get('/api/update', (req, res, next) => {
  io.emit('update');
  res.status(200).send('Remotes updated to database');
  next();
});

app.use('/api/remote/:button', (req, res, next) => {
  if (!req.params.button) {
    io.emit('error', 'error');
    return next(createError(400, 'Invalid Button'));
  }
  io.emit('post', [req.params.button]);
  res.status(200).send('sent ' + req.params.button + ' to remote.');
  next();
});

app.use('/api', authRouter);
app.use('/api', userRouter);
// app.use('/api', remoteRouter);

app.all('*', function(req, res, next) {
  next(createError(404, `Error: ${req.method} :: ${req.url} is not a route`));
});
app.use(errorHandler);

app.listen(PORT, () => console.log('server up on 3000'));
