var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const orderSchema = new Schema({
  name: String,
  phone: String,
  status: String,
  key: String,
  pizzas: [{ pizzaName: String, amount: Number}]
})

module.exports = mongoose.model('Order', orderSchema);