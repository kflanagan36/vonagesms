'use strict'

require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http')
const unirest = require('unirest')

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const eventUrl = process.env.EVENT_URL

app.use(bodyParser.json())

app.post('/webhooks/sms', (request, response) => {
  
  console.log(request.body)
  console.log(request.body.msisdn)
  const phoneNumber = request.body.msisdn
  console.log(request.body.text)
  const receivedMsg = request.body.text
  
  // Do something with the received message and generate a response
  const responseMsg = `Thank you for your message: "${receivedMsg}". We will get back to you soon.`
  
  sendMsg(phoneNumber, responseMsg)

  response.status(204).send()
})

function sendMsg(phoneNumber, responseMsg) { 
  console.log('sendMsg');
  console.log(phoneNumber, responseMsg);

  var req = unirest('POST', 'https://messages-sandbox.nexmo.com/v1/messages')
    .headers({
      'Authorization': 'Basic ' + Buffer.from(apiKey + ':' + apiSecret).toString('base64'),
      'Content-Type': 'application/json'
    })
    .send(JSON.stringify({
      "from": "NEXMO",
      "to": phoneNumber,
      "message_type": "text",
      "text": responseMsg
    }))
    .end(function (res) { 
      if (res.error) throw new Error(res.error); 
      console.log(res.raw_body);
    });
}

const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
