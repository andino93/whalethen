const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const options = { promiseLibrary: Promise, useMongoClient: true };

mongoose.connect('mongodb://localhost/whaleThen', options);
const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

const eventSchema = mongoose.Schema({
  name: String,
  type: String,
  votes: { type: Number, default: 0 },
});

const daySchema = mongoose.Schema({
  day: Number,
  id: Number,
  events: [eventSchema],
});

const Day = mongoose.model('Day', daySchema);
const Event = mongoose.model('Event', eventSchema);
