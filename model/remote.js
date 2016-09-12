'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let remoteSchema = Schema({
  name: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  controls: {type: String, required: true}
});


module.exports = exports = mongoose.model('Remote', remoteSchema);