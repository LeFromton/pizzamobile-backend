const dotenv = require('dotenv')
const request = require('request')

dotenv.config()

exports.sendSMS = (order) => {
  var options = { 
    method: 'POST',
    url: 'https://www.epai-ict.ch/m120/api/smsmessaging',
    headers: {
      'cache-control': 'no-cache',
      'Authorization': 'Bearer ' + process.env.SMS_TOKEN,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: { 
      phone: order.phone, 
      message: "Votre commande est prête, veuillez vous diriger en direction du point de retrait" 
    },
    json: true
  }
  
  console.log(options)
  request(options, function (error, response, body) {
    if (error) {
      throw new Error(error)
    }
    console.log(body)
  })
}
