var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');
var request = require('request');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const arrayOfEndpoints = [
];

app.get('/get_endpoints', function(req, res) {
  res.status(200).json(arrayOfEndpoints);
});

app.post('/insert_endpoint', function(req, res) {
  const newEndpoint = req.body.url;
  arrayOfEndpoints.push(newEndpoint);
  res.status(201).json(arrayOfEndpoints);
});

app.use('/', function(req, res, next) {
  async.each(arrayOfEndpoints, function(eachEndpoint, callback) {
    request({
      url: eachEndpoint,
      method: 'POST',
      json: req.body,
      qs: req.query
    }, function(error, response, body) {
      console.log(body);
      callback(error);
    });
  }, function(err){
    res.status(200).json({
      'status': 'success'
    });
  });
});

module.exports = app;
