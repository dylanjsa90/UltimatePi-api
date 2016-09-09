'use strict';

const app = require('express')();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./lib/error-handler');
const Promise = require('./lib/promise');
mongoose.Promise = Promise;

// Universial Pi Code
const server = require('http').Server(app);
const io = require('socket.io')(server);
// end -except get /update
const PORT = process.env.PORT || 3000;
const dbPort = process.env.MONGODB_URI || 'mongodb://localhost/dev_db';
mongoose.connect(dbPort);

const userRouter = require('./routes/user-router');

app.use(morgan('dev'));
app.use(errorHandler());
app.use(cors());

app.get('/api/update', (req, res, next) => {
  io.emit('update');
  res.status(200).send('Remotes updated to database');
  next();
});

app.use('/api/user', userRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message || 'Server Error');
  next();
});

module.exports = exports = server.listen(PORT, () => console.log('server up'));