"use strict"

const POS = require('pos');
const TAGGER = new POS.Tagger();
const PLURALIZE = require('pluralize');


/*
  Takes a word ['word', 'partOfSpeech']
  Returns a boolean indicating whether it is a non-proper noun
*/
let isNoun = function(wordInput) {
	let word = wordInput[0];
	let speechPart = wordInput[1];
	let disqualified = ['I', 've', 'm', 't', 's']; //some things are counted as nouns but should not be
	if (speechPart === 'NN' || speechPart === 'NNS') {
		return disqualified.indexOf(word) === -1;
	} else {
		return false;
	}
}


/*
  Takes a noun ['noun', 'partOfSpeech']
  If the noun is singular, returns it
  If plural:
    Returns singular if it exists
    Otherwise, just returns back the original word
*/
let getSingular = function(wordInput) {
	let word = wordInput[0];
	let speechPart = wordInput[1];
	if (speechPart === 'NN') {
		return word;
	} else {
		let singlr = PLURALIZE.singular(word)
		if (singlr && singlr.length > 0) {
			return singlr;
		} else {
			return word;
		}
	}
}



/*
  Takes a string
  Returns an array of all the words, tagged by POS (eg ['word', 'pos'])
*/
let tagWords = function(string) {
	let words = new POS.Lexer().lex(string);
	return TAGGER.tag(words);
}



/*
  Takes an array of words tagged by POS
  Returns all of the nouns, singularized
*/
let filterNouns = function(wordsArray) {
	return wordsArray.filter(word => isNoun(word)).map(word => getSingular(word));
}

/*
  Takes a string
  Returns an array of all the nouns in that string (as singulars if  possible)
*/
let getNouns = function(string) {
	let tagged = tagWords(string);
	let onlyNouns = filterNouns(tagged);
	console.log('only nouns as strings', onlyNouns);
	return onlyNouns;
}
module.exports.getNouns = getNouns;

// let myWords = [
//   'Amazing So nice people Helpful Friendly Wonderful food Amazing unique drinks and ingredients',
//   'Went on a Friday night with a group of friends, service was good considering we had a fairly large group, the food was average.The best part of the meal was the nachos we had as an appetizer. The atmosphere was great, the bartender was very knowledgeable, overall was just hoping the food would have been better.',
//   "This small California-based chain brings an upscale bar and dining experience to Dirty Sixth just across the street from The Driskill Hotel. I've only come here for drinks during SXSW, so my review does not pertain to the culinary experience. A large central bar occupies the majority of this establishment and offers up a large selection of craft beers and whisky. They have solid daily specials and two happy hours each day (2-6PM and 9-11PM).",
//   "We stumbled into this little restaurant on a quest for onion rings but decided to stay for a full meal. The interior is industrial and beautiful and the restaurant had an inviting, friendly vibe.",
//   "We ordered the panko onion rings to share, which ended up being three of the biggest onion rings I've ever seen in my life. They were tasty but nothing to write home about. I was a bit disappointed by the slow roasted beet salad. I had been super excited about the watermelon pop rocks that they include in their version of this classic salad, but the experience was lackluster. The residual moisture in the salad made the rocks pop too early, so I was left with pink goo sprinkled around my plate rather than the nice crackling experience I was anticipating. The beets were also not great. They were undercooked and chopped into enormous chunks that I found unmanageable.",
//   "We started with one waitress who was really wonderful, but we must have caught her at the end of her shift because she disappeared halfway through. Still, service was friendly and efficient.",
//   "It was happy hour, so I asked my bartender which food special he recommended. Together we went with the chicken tacos. They did not disappoint. (Note: I didn't have a single disappointing taco in this town, including the airport). My bartender also gave me many samples of beers to help me make my selection. (Well, he did that until he got too busy to give me as much special attention--bartender attention is just one of the many benefits to day drinking). ",
//   "In short, Yelp wins again! Thanks to the Yelpers who visited before me to help me drink good beer and nosh good tacos.",
//   "I've been to multiple Eurekas around the country and I must say this is probably the best one I've been to. Great beer selection with many local taps. Love the atmosphere and setup. Great location as well. "
// ]

// myWords.forEach(function(string) {
// 	getNouns(string);
// })


