var express = require('express')

var Promise = require('bluebird')
var db = require('./db-helpers')

console.log('we are in review-api')

var MintAPI = module.exports = express.Router()
//{ mergeParams: true }


MintAPI.get('/', function(req, res) {
  console.log('params', req.query)
  db.selectAllReviews(req.business_name)
  .then(function(reviews){
    res.send(reviews)
  })
})

MintAPI.get('/stars', function(req, res) {
  console.log('params', req.query)
  db.selectAllReviews(req.business)
  .then(function(reviews){
    res.send(reviews)
  })
})

MintAPI.get('/date', function(req, res) {
  console.log('params', req.query)
  db.selectAllReviews(req.business)
  .then(function(reviews){
    res.send(reviews)
  })
})
