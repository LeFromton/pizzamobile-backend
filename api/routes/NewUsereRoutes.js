const express = require('express')
const router = express.Router()
const Auth = require('../modules/Auth')

const User = require('../models/Users')

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
})

router.route('/api/users')
  .get(Auth.login(req, res), (req, res) => {
    
  })
  
  .post(Auth.signup(req, res), (req, res) => {

  })

router.route('/api/users/:userId')
  .get((req, res) => {

  })

  .put((req, res) => {

  })

  .delete((req, res) => {

  })
  
module.exports = router