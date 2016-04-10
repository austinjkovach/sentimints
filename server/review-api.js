var express = require('express')

var Promise = require('bluebird')
var db = require('./db-helpers')
var sentiments = require('./sentiments.js');

console.log('we are in review-api')

var MintAPI = module.exports = express.Router()
//{ mergeParams: true }

MintAPI.get('/', function(req, res) {
  var business_name = req.query.business_name + ''
  db.selectAllReviews(business_name)
  .then(function(reviews){
    return sentiments.getAllFromReviews(reviews);
  })
  .then(function(sentiments){
    res.send(sentiments)
  })
  .catch(function(err){
    console.error('OH NO. SENTIMENT ERROR', err);
    res.status(500).send(err);
  })
})

MintAPI.get('/stars', function(req, res) {
  var business_name = req.query.business_name + ''
  var stars = req.query.business_stars.split('_')
  db.selectByStars(business_name, stars)
  .then(function(reviews){
    return sentiments.getAllFromReviews(reviews)
  })
  .then(function(sentiments){
    res.send(sentiments)
  })
  .catch(function(err){
    console.error('OH NO. SENTIMENT ERROR', err);
    res.status(500).send(err);
  })
})

MintAPI.get('/date', function(req, res) {
  var business_name = req.query.business_name + ''
  var dates = req.query.business_date.split('_')
  db.selectByDate(business_name, dates)
  .then(function(reviews){
    return sentiments.getAllFromReviews(reviews)
  })
  .then(function(sentiments){
    res.send(sentiments)
  })
  .catch(function(err){
    console.error('OH NO. SENTIMENT ERROR', err);
    res.status(500).send(err);
  })
})
