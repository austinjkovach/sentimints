"use strict"

const FETCH = require('node-fetch');
FETCH.promise = require('bluebird');
const Promise = require('bluebird');
const hod = require('havenondemand');
const api = process.env['SENTIM'];
const SS = require('summary-statistics')

const client = new hod.HODClient(api); //version is optional second argument - right now I don't see a need

const resultUrl = 'https://api.havenondemand.com/1/job/result/';
const API_URL = '?apikey=' + api;



/*
  Takes a object we get back from an API call
  Returns only the result object
*/
let getResult = function(resultFromAPI) {
	let parsed = JSON.parse(resultFromAPI);
	console.log('got parsed', parsed);
	console.log('passed into getResult', resultFromAPI)
	return parsed.actions[0].result;
}



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
				resolve(id);
			}
		})
	})
	.then( function(id) {
		return getCompletedJob(id)
	})
	.then( function(result) {
		return getResult(result);
	})
	.catch( function(err) {
		throw err;
	})
}









/*
  Takes one review (thing you got back from API)
  Returns the same object stored at "aggregate: {
	sentiment: "negative",
	score: -0.322112
  }
*/
let getAggregate = function(resultOfSentimentAnalysis) {
	return resultOfSentimentAnalysis.aggregate;
}




/*
  Take one review (thing you get back from the API)
  Returns a single array of all sentiments for that review, eg an array of these:
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
let getSentiments = function(resultOfSentimentAnalysis) {
	let positiveSents = resultOfSentimentAnalysis.positive;
	let negativeSents = resultOfSentimentAnalysis.negative;
	return positiveSents.concat(negativeSents);
}


/*
  Takes an array of scores
  Returns an object with the following: {
  	num: (ie n),
  	sum: (total of all),
  	avg: (average score),
  	min: (min score),
  	q1: (25th percentile),
  	median: (50th percentile),
  	q3: (75th percentile),
  	max: (max score)
  }
*/
let getSummStats = function(scoresArray) {
	return SS(scoresArray);
}




/*
  Takes an array of sentiments with keys: {sentiment, topic, score, original_text, original_length, normalized_length,normalized_text}
  Returns aa map with the keys equal to the topics, and the values equal an object with one property ("scores")
    The scores property holds an array of all the scores
*/
let topicsMap = function(resultsArray) {
	let topics = new Map();
	resultsArray.forEach( (result) => {
		let topic = result.topic;
		let score = result.score;

		let scores = topics.get(topic).scores || [];
		scores.push(score);
		topics.set(topic, {scores: scores});
	})
	return topics;
}


/*
  Takes the map returned from topicsMap()
  Puts each object in an array with the following: {
	topic: topic,
	stats: summary stats object of topic scores
  }
  Returns this array sorted from highest median to lowest median
*/
let topicsScores = function(mapOfTopics) {
	let topicsWithScores = [];
	for (let [k, v] of mapOfTopics.entries()) {
		let topicObject = {topic: k};
		topicObject.stats = getSummStats(v.scores);
		topicsWithScores.push(topicObject);
	}
	return topicsWithScores;
}



/*
  Takes an array with the following elements: [{topic, stats}, ....]
  Returns an object with the summary statistics of the median
*/
let summStatsOfMedians = function(topicsWithScores) {
	let medians = topicsWithScores.map( topicObj => topicObj.stats.median);
	return getSummStats(median);
}



/*
  First argument: an array of all topics, with the follwing properties: {
	topic: topic,
	stats: summary stats object of topic scores
  }
  Second argument: the summary statistics of the medians
  Returns the elements of the original with a median in the lowest 25th percentile
*/
let getBottomQuartile = function(allTopics, medianSummStats) {
	let q3 = 
}




/*
  Takes an array of texts
  Returns:
  {
	aggregate: {
	  All: {Summary stats of all},
	  Positive: {Summary stats of positive},
	  Negative: {Summary stats of negative}
	},
	topical: {
	  Worst: [Array of topics with lower 25th percentile (by median), each formatted: {topic: "Blah", stats: Summary stats}],
	  Best: [Array of topics with upper 25th percentile (by median)],
	  Hot: [Array of top 25th percentile of popularity]
	}
  }
*/
let getAll = function(arrayOfTexts) {
	let reviewAggregates = [];
	let allSentiments = [];

	let allData = {aggregate: {}, topical: {}};

	return Promise.all(arrayOfTexts.map( (text) => {
		return analyzeText(analyzeText)
		  .then( (result) => {
		  	let sentiments = getSentiments(result);
		  	console.log('sentiments for this review', sentiments)
		  	allSentiments.push(sentiments);

		  	let agg = getAggregate(result);
		  	console.log('aggregate for this review', agg);
		  	reviewAggregates.push(agg);
		  })
	}))
	.then( function() {
		//handle reviewAggregates

		//handle allSentiments
		let summarizedTopics = topicsScores(topicsMap(allSentiments));
	})
}





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




