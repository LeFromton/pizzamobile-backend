const express = require('express')
const router = express.Router()
const Auth = require('../modules/Auth')


// Import mongoose schemas/models
const Order = require('../models/Orders')

// Middleware that is specific to this router
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Content-type', 'application/json')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  console.log('Time: ', Date.now())
  next()
})

router.route('/api/orders')
  // Return all orders
  .get(Auth.verifyToken, (req, res) => {
    try {
      Order.find().lean().exec((errors, orders) => {
        if (orders.length == 0) {
          res.sendStatus(400)
        } else {
          res.send(JSON.stringify(orders))
        }
      })
    } catch (error) {
      res.sendStatus(400)
      throw error
    }
  })
  // New Orders
  .post(Auth.verifyToken, (req, res) => {
    try {
      req.body.order.key = Math.random().toString(16).substr(2, 8)
      Order.create(req.body.order)
      res.sendStatus(201)
    } catch (error) {
      res.sendStatus(400)
      throw error
    }
  })


router.route('/api/orders/:orderId')
  // Return specific order
  .get((req, res) => {
    try {
      Order.findById({ _id: req.params.orderId}).lean()
      .exec((error, order) => {
        if (order == null) {
          res.sendStatus(400)
        } else {
          res.send(JSON.stringify(order))
        }
      })
    } catch (error) {
      res.sendStatus(400)
      throw error
    }
  })

  // Update specific order(s)
  .put(Auth.verifyToken, (req, res) => {
    try {
      Order.findOneAndUpdate({ _id: req.params.orderId }, req.body.order, { new: true })
        .lean().exec((errors, order) => {
          if (order == null) {
            res.sendStatus(400)
          } else {
            res.sendStatus(202)
          }
      })
    } catch (error) {
      res.sendStatus(400)
      throw error
    }
  })

  // Remove specific order(s)
  .delete(Auth.verifyToken, (req, res) => {
    try {
      let filter = { _id: req.params.orderId }
      Order.findOneAndDelete(filter)
        .lean().exec((error) => {
          res.sendStatus(202)
      })
    } catch (error) {
      res.sendStatus(400)
      throw error
    }
  })
  
router.route('/api/orders/:orderId/:orderKey')
  .get((req, res) => {
    try {
      Order.findById({ _id: req.params.orderId }).lean().exec((error, order) => {
        if(error){ res.sendStatus(500); throw error }
        if(order.key == req.params.orderKey){ res.send(order) } else { res.send(401) }
      })
    } catch (error) {
      throw error
    }
  })
  
  
  // Get filtered orders (for the views)
router.route('/api/orders/filters/:filter')
  .get(Auth.verifyToken, (req, res) => {
    try {
      Order.find({ status: req.params.filter}).lean().exec(function (error, orders) {
        if (order == null) {
          res.sendStatus(400)
        } else {
          res.send(orders)
        }
      })
    } catch (error) {
      res.sendStatus(400)
      throw error
    }
  })

module.exports = router