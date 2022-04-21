const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const Auth = require('../modules/Auth')

// middleware that is specific to this router
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Content-type', 'application/json')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  console.log('Time: ', Date.now())
  next()
})

// Pre-auth requests
router.route('/api/users/login')
  .post((req, res, next) => {
    Auth.login(req, res, next)
  })

router.route('/api/users/register')
  .post((req, res, next) => {
    Auth.register(req, res, next)
  })


// Admin requests
router.route('/api/users')
  .get(Auth.verifyToken, (req, res, next) => {
    try {
      if(req.user.role !== "admin"){ res.sendStatus(401) }
      User.find().lean().exec((error, users) => {
        if(error){ throw error }
        if(users.length == 0){ res.sendStatus(404) }
        if(users.length >= 1){ res.send(users) }
      })  
    } catch (error) {
      throw error
    }
  })

// User specific requests
router.route('/api/users/:userId')
  .get(Auth.verifyToken, (req, res, next) => {
    try {
      if(req.user._id == req.params.userId){
        res.send()
      } else {
        User.findById({ _id: req.params.userId }).lean().exec((error, user) => {
          if(error){ res.sendStatus(404) }
          if(user){ res.send(user) }
        })
      }
    } catch (error) {
      res.sendStatus(500)
      throw error
    }
  })

  .put(Auth.verifyToken, (req, res) => {
    if(req.user.role !== "admin"){ res.sendStatus(401)}
    User.findOneAndUpdate({ _id: req.params.userId }, req.body.updatedUser, { new: true })
      .lean().exec((error, user) => {
        if(error){ res.send(400) }
        if(user.length == 0){ res.send(404) } else { res.send(user) }
    })
  })

  .delete(Auth.verifyToken, (req, res) => {
    if(req.user.role !== "admin" || req.user._id == req.params.userId){ res.sendStatus(401)}
    User.findOneAndDelete({ _id: req.params.userId }).lean().exec((error) => {
      if(error){ res.send(error) }
      if(!error){ res.sendStatus(200)}
    })
  })
  
module.exports = router