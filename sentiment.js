"use strict"

const FETCH = require('node-fetch');
FETCH.promise = require('bluebird');

const Promise = require('bluebird');
const hod = require('havenondemand');
const api = process.env['SENTIM'];

const client = new hod.HODClient(api); //version is optional second argument - right now I don't see a need

const resultUrl = 'https://api.havenondemand.com/1/job/result/';
const API_URL = '?apikey=' + api;




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
  Takes a text string (ie a review, eg 'This restaurant sucks and their chips are crappy')
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



/*
  Take one review
  Returns a single array of all sentiments for that review, eg:
	   {
	        "sentiment": "awesome",
	        "topic": "dogs",
	        "score": 0.8952832264587852,
	        "original_text": "dogs are awesome",
	        "original_length": 16,
	        "normalized_text": "dogs are awesome",
	        "normalized_length": 16
	    }
*/



/*
Aggregate (by review)
- Summary stats
- Summary stats for positive
- Summary stats for negative

Count of positive vs negative reviews (based on overall thing)
Hot topics - most frequent topics
Summary statistics by topic
Shows lowest quarter by 

By topic:
- Most postive topics (bottom 25th)
- Most negative topics
- Hottest (recency + frequency)

*/




