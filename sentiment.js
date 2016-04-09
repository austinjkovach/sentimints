"use strict"

// const HTTPS = require('https');
const FETCH = require('node-fetch');
FETCH.promise = require('bluebird');

const Promise = require('bluebird');
const hod = require('havenondemand');
const api = process.env['SENTIM'];
console.log('api key', api)

const client = new hod.HODClient(api); //version is optional second argument - right now I don't see a need

// const url = 'https://api.havenondemand.com/1/api/async/analyzesentiment/v1';
const resultUrl = 'https://api.havenondemand.com/1/job/result/';
const API_URL = '?apikey=' + api;

// let data = {'text': 'I fucking hate cats'};

// client.call('analyzesentiment', data, true, function(err, resp, body) {
// 	console.log('err', err);
// 	// console.log('resp', resp);
// 	console.log('body', body);
// 	let jobId = body.data.jobID;
// 	console.log('jobId, ', jobId)

// })

/*
  Takes a job ID
  Returns the result from the API call
*/
let getCompletedJob = function(jobId) {
	let newUrl = resultUrl + jobId + API_URL;

	return FETCH(newUrl)
	  .then(function(res) {
	  	return res.text()
	  })
	  .then(function(body) {
	  	console.log('got data from fetch', body);
	  	return body;
	  })
	  .catch( function(err) {
	  	console.log('error', err)
	  	throw new Error('Error getting completed job');
	  })
}

/*
  Takes a text string (ie a review)
  Returns the result from the sentiment analysis (the full object)
*/
let analyzeText = function(textString) {

	let data = {'text': textString};
	return new Promise( function(resolve, reject) {
		client.call('analyzesentiment', data, true, function(err, resp, body) {
			if (err) {
				reject('Error creating sentiment job', err);
			} else {
				let id = body.data.jobID;
				console.log('id to be passed in', id);
				resolve(id);
			}
		})
	})
	.then( function(id) {
		console.log('got id', id);
		return getCompletedJob(id)
	})
	.then( function(result) {
		console.log('got result', result);
		return result;
	})
	.catch( function(err) {
		throw err;
	})
}

// let myText = 'Cats are stupid and dogs are awesome.'

// return analyzeText(myText)
//   .then(function(got) {
//   	console.log('got this from analyzeText', got);
//   })




/*
var data = {'text' : 'I like cats'}
let data = {'file' : 'test.txt'}

client.call('analyzesentiment', callback, data)

var callback = function(err,resp,body){
  console.log(body)
}

client.call('analyzesentiment', data, callback, true)

*/