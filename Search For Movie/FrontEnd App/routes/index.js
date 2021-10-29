CryptoJS = require('crypto-js');
var util = require('util');
var express = require('express');
var router = express.Router();
var moment = require('moment');
var unixtime = moment.unix();
var secret = "{{YOUR_API_SECRET}}";
var api_login = "{{YOUR_API_LOGIN}}";
const axios = require('axios');

router.post("/", function (req, res, next) {
  var query = req.body.queryTxt;
  var body = { "ops": [{ "company_id": "{{YOUR_COMPANY_ID}}", "conv_id": "{{YOUR_CONV_ID}}", "type": "create", "obj": "task", "data": { "movieName": query } }] };
  body = JSON.stringify(body, null, 4);
  var signature = CryptoJS.SHA1(unixtime + secret + body + secret);
  signature = CryptoJS.enc.Hex.stringify(signature);
  axios
    .post('{{YOUR_MPO_SANDBOX_URL}}' + api_login + '/' + unixtime + '/' + signature, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      var result = JSON.stringify(response.data.ops[0].data.movie, null, 4);
      res.render("index", { movieInfo: result });
    })
    .catch(error => {
      res.render("index",{movieInfo: "Film could not be found"});
    })
})

router.get('/', function (req, res, next) {
  res.render('index');
});

module.exports = router;
