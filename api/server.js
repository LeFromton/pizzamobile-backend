// DB and HTTPD packages
const express = require('express')
const mongoose = require('mongoose')

// HTTPD Addons
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

// Import routes
const UserRoutes = require('./routes/UserRoutes')
const OrderRoutes = require('./routes/OrderRoutes')

// Try DB Connection
try {
  mongoose.connect('mongodb://localhost:27017/PizzaMobileDB')
  mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
  })
} catch (error) {
  throw error
}

// HTTPD initiation
const app = express()
  // Add addons
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())

  // Add routes
  app.use(OrderRoutes)
  app.use(UserRoutes)

  // Specify API port
  app.listen(process.env.API_PORT)

  // Set default headers
  app.use(function (req, res, next) {
    next();
  })