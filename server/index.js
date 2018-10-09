var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var database = require('../database/data.js');
var stripe = require("stripe")("pk_test_wd9rThkNdTfjOnS9RXQIFPv6");

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/dist'));

app.post('/smartWash', function(req, res){
  let times = req.body.times;

  if(!times) {
    res.sendStatus(400);
  } else {
    database.insertHour (times, (err, results) => {
      if (err) {
        res.status(500);
      } else {
        res.status(200).json(results);
      }
    });
  }
});

app.post('/api/stripe', function(req, res, next) {
  const stripeToken = req.body.stripeToken;

    stripe.charges.create({
  amount: 999,
  currency: 'usd',
  description: 'Example charge',
  source: stripeToken,
}, function(err,charge){
    console.log('charge');
  if (err){
    res.send({
      success: false,
      message: 'Error'
    })
  } else{
    res.send({
      success: true,
      message: 'Success'
      });
    }
  });
});

app.listen(3000, function() {
  console.log('Server started and listening on port 3000');
});
