var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")
var User = require("../models/Users")
const { use } = require("bcrypt/promises")
const dotenv = require('dotenv')
const { rawListeners } = require("../models/Users")

dotenv.config()

// To add a new user
exports.register = (req, res, next) => {
  var user = {
    fullName: req.body.user.fullName,
    email: req.body.user.email,
    role: req.body.user.role,
    password: bcrypt.hashSync(req.body.user.password, 8)
  }

  User.create(user, (error, user) => {
    if(error){
      res.sendStatus(500)
      throw error
    } else {
      res.send(user)
      next()
    }
  })
}

// To authenticate a user
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.user.email }).exec((error, user) => {
    if(error){ res.sendStatus(500) }
    if(!user){ res.sendStatus(404) }
    if(!isPwdValid(req, user)){ 401 }

    var token = jwt.sign({
      id: user.id
    }, process.env.API_SECRET, {
      expiresIn: 86400
    })

    res.send({
      user: {
        _id: user._id,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        email: user.email,
        jwt: token
      }})
      next()
  })
}

// To verify JWT
exports.verifyToken = function (req, res, next) {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.sendStatus(400)
  } else {
    jwt.verify(req.body.user.jwt, process.env.API_SECRET, (error, decode) => {
      if(error){ res.sendStatus(500) }
      console.log(decode)
      User.findOne({ _id: decode.id }).exec((error, user) => {
        if(error){ res.sendStatus(404) }
        if(user.email !== req.body.user.email) { res.sendStatus(401) }
        req.user = user
        next()
      })
    })
  }
}

// To Compare passwords
function isPwdValid(req, user){
  var pwdIsValid = bcrypt.compareSync(
    req.body.user.password,
    user.password
  )
  if(pwdIsValid) {
    return true
  } else {
    return false
  }
}