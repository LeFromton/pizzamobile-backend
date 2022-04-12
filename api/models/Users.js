var mongoose = require('mongoose'),
  Schema = mongoose.Schema

/**
 * User Schema
 */
const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "fullname not provided "],
  },
  email: {
    type: String,
    unique: [true, "email already exists in database!"],
    lowercase: true,
    trim: true,
    required: [true, "email not provided"]
  },
  role: {
    type: String,
    enum: ["dev", "cook", "delivery", "cashier", "admin"],
    required: [true, "Please specify user role"]
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)