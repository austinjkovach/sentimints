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

		let scores = [];
		if ( typeof topics.get(topic) !== "undefined") {
			scores = topics.get(topic).scores;
		}

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
	for (let k of mapOfTopics.keys()) {
		let topicObject = {topic: k};
		let v = mapOfTopics.get(k);
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
	console.log('medians', medians);
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
	let q1 = medianSummStats.q1;
	return allTopics.filter(t => t.stats.median < q1);
}


/*
  First argument: an array of all topics, with the follwing properties: {
	topic: topic,
	stats: summary stats object of topic scores
  }
  Second argument: the summary statistics of the medians
  Returns the elements of the original with a median in the highest 25th percentile
*/
let getTopQuartile = function(allTopics, medianSummStats) {
	let q3 = medianSummStats.q3;
	return allTopics.filter(t => t.stats.median > q3);
}




/*
  Takes an array of all topics
  Returns the 
*/
let topicFrequencies = function(allTopics) {
	console.log('passed into topicFrequencies', allTopics,'an', typeof allTopics)
	let nData = allTopics.map(t => t.stats.num)
	return getSummStats(nData);
}


/*
  First argument: an array of all topics, with the follwing properties: {
	topic: topic,
	stats: summary stats object of topic scores
  }
  Second argument: Summary statistics of the frequencies
  Returns the elements that are in the top 25th percentile of most frequencly commented on
*/
let mostPopular = function(allTopics, frequencySummStats) {
	let q3 = frequencySummStats.q3;
	return allTopics.filter(t => t.stats.num > q3);
}







/*
  Takes an array of texts
  Returns:
  {
	aggregate: {
	  all: {Summary stats of all},
	  positive: {Summary stats of positive},
	  negative: {Summary stats of negative}
	},
	topical: {
	  worst: [Array of topics with lower 25th percentile (by median), each formatted: {topic: "Blah", stats: Summary stats}],
	  best: [Array of topics with upper 25th percentile (by median)],
	  hot: [Array of top 25th percentile of popularity]
	}
  }
*/
let getAll = function(arrayOfTexts) {
	let reviewAggregates = [];
	let allSentiments = [];

	let allData = {aggregate: {}, topical: {}};

	return Promise.all(arrayOfTexts.map( (text) => {
		return analyzeText(text)
		  .then( (result) => {
		  	console.log('my result is', result);
		  	let sentiments = getSentiments(result);
		  	console.log('sentiments for this review', sentiments)
		  	allSentiments = allSentiments.concat(sentiments);

		  	let agg = getAggregate(result);
		  	console.log('aggregate for this review', agg);
		  	reviewAggregates.push(agg);
		  })
	}))
	.then( function() {
		console.log('reviewAggregates at this point is', reviewAggregates,'an', typeof reviewAggregates);
		console.log('allSentiments at this point is', allSentiments,'an', typeof allSentiments);
		//handle reviewAggregates

		//handle allSentiments
		let summarizedTopics = topicsScores(topicsMap(allSentiments));
		let frequencySummaryStatistics = topicFrequencies(summarizedTopics);
		let medianSummaryStatistics = topicFrequencies(summarizedTopics);
		console.log('median summary stats', medianSummaryStatistics);
		allData.topical.worst = getBottomQuartile(summarizedTopics, medianSummaryStatistics);
		console.log('worst is', allData.topical.worst);
		allData.topical.best = getTopQuartile(summarizedTopics, medianSummaryStatistics);
		console.log('best is', allData.topical.best);
		allData.topical.hot = mostPopular(summarizedTopics, frequencySummaryStatistics);

		return allData;
	})
}

let myWords = [
  'Amazing So nice people Helpful Friendly Wonderful food Amazing unique drinks and ingredients',
  'Went on a Friday night with a group of friends, service was good considering we had a fairly large group, the food was average.The best part of the meal was the nachos we had as an appetizer. The atmosphere was great, the bartender was very knowledgeable, overall was just hoping the food would have been better.',
  "This small California-based chain brings an upscale bar and dining experience to Dirty Sixth just across the street from The Driskill Hotel. I've only come here for drinks during SXSW, so my review does not pertain to the culinary experience. A large central bar occupies the majority of this establishment and offers up a large selection of craft beers and whisky. They have solid daily specials and two happy hours each day (2-6PM and 9-11PM).",
  "We stumbled into this little restaurant on a quest for onion rings but decided to stay for a full meal. The interior is industrial and beautiful and the restaurant had an inviting, friendly vibe.",
  "We ordered the panko onion rings to share, which ended up being three of the biggest onion rings I've ever seen in my life. They were tasty but nothing to write home about. I was a bit disappointed by the slow roasted beet salad. I had been super excited about the watermelon pop rocks that they include in their version of this classic salad, but the experience was lackluster. The residual moisture in the salad made the rocks pop too early, so I was left with pink goo sprinkled around my plate rather than the nice crackling experience I was anticipating. The beets were also not great. They were undercooked and chopped into enormous chunks that I found unmanageable.",
  "We started with one waitress who was really wonderful, but we must have caught her at the end of her shift because she disappeared halfway through. Still, service was friendly and efficient.",
  "It was happy hour, so I asked my bartender which food special he recommended. Together we went with the chicken tacos. They did not disappoint. (Note: I didn't have a single disappointing taco in this town, including the airport). My bartender also gave me many samples of beers to help me make my selection. (Well, he did that until he got too busy to give me as much special attention--bartender attention is just one of the many benefits to day drinking). ",
  "In short, Yelp wins again! Thanks to the Yelpers who visited before me to help me drink good beer and nosh good tacos.",
  "I've been to multiple Eurekas around the country and I must say this is probably the best one I've been to. Great beer selection with many local taps. Love the atmosphere and setup. Great location as well. "
]

return getAll(myWords)
  .then(function(x) {
  	// console.log('ended up with this object', x)
  })

// return analyzeText(myWords[0])
//   .then( function(txt) {
//   	console.log('got', txt, 'from first')
//   })

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




