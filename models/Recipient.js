const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false }
});

// We export this schema because its a sub-document collection. It'll be used in Survey.js
module.exports = recipientSchema;
