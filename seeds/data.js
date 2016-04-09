
exports.seed = function(knex, Promise) {
  console.log('inside data insert');
  return Promise.join(
    knex('business').insert([
          {"business_id": "1", "business_name": "Pittsburgh Steelers", "full_address": "100 Art Rooney Ave\nNorth Side\nPittsburgh, PA 15212",   "longitude": -80.0169205773965,  "business_stars": 4.5, "latitude": 40.4459596591592},
          {"business_id": "2", "business_name": "Tom's Diner", "full_address": "2937 W Liberty Ave\nDormont\nPittsburgh, PA 15216",   "longitude": -80.0350906,  "business_stars": 3.5, "latitude": 40.3942666},
          {"business_id": "3", "business_name": "Cain's Saloon", "full_address": "3239 W Liberty Ave\nDormont\nPittsburgh, PA 15216", "longitude": -80.0409102,  "business_stars": 3.5, "latitude": 40.3897336},
          {"business_id": "4", "business_name": "Port Authority of Allegheny County", "full_address": "345 6th Ave\nShadyside\nPittsburgh, PA 15222",   "longitude": -79.928437,  "business_stars": 2.5, "latitude": 40.458139},
          {"business_id": "5", "business_name": "The Westin Charlotte", "full_address": "601 South College Street\nUptown\nCharlotte, NC 28202",   "longitude": -80.8473977,  "business_stars": 3.5, "latitude": 35.2215512},
          {"business_id": "6", "full_address": "171 E Bridge St\nHomestead\nHomestead, PA 15120", "review_count": 124, "business_name": "Rock Bottom", "longitude": -79.9152619, "business_stars": 3.5, "latitude": 40.4094353},
          {"business_id": "7", "full_address": "185 W Waterfront Dr\nHomestead\nPittsburgh/Waterfront, PA 15120", "review_count": 99, "business_name": "Mitchell's Fish Market", "longitude": -79.9180894261369, "business_stars": 3.5, "latitude": 40.4088783792259},
          {"business_id": "8", "full_address": "6738 Reynolds St\nPoint Breeze\nPittsburgh, PA 15206",  "review_count": 60, "business_name": "Pino's Contemporary Italian Restaurant & Wine Bar", "longitude": -79.9145, "business_stars": 3.0, "latitude": 40.450249},
          {"business_id": "9", "full_address": "1125 N Highland Ave\nHighland Park\nPittsburgh, PA 15206", "review_count": 106, "business_name": "Tazza D'oro Cafe & Espresso Bar", "longitude": -79.9188657, "business_stars": 4.5, "latitude": 40.4748883},
          {"business_id": "10", "full_address": "5880 Centre Ave\nShadyside\nPittsburgh, PA 15206", "review_count": 106, "business_name": "Whole Foods Market", "longitude": -79.928830198608, "business_stars": 3.5, "latitude": 40.4585106474725}
    ])
  );
};
