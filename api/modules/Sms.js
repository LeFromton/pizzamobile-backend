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
      message: "Bonjour, votre commande est presque prête, veuillez vous diriger vers le point de retrait. Merci" 
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
