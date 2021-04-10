const mongoose = require('mongoose')

const logsSchema = mongoose.Schema({
  serverID: { type: String },
  userID: { type: String },
  userName: { type: String },
  mod: { type: String },
  type: { type: String },
  reason: { type: String },
  date: { type: String }
})
module.exports = mongoose.model('Log', logsSchema)