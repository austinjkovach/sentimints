
exports.seed = function(knex, Promise) {
  console.log('inside data insert');
  return Promise.join(
    knex('business').insert([
          {"business_id": "1", "full_address": "100 Art Rooney Ave\nNorth Side\nPittsburgh, PA 15212",   "longitude": -80.0169205773965,  "business_stars": 4.5, "latitude": 40.4459596591592},
          {"business_id": "2", "full_address": "2937 W Liberty Ave\nDormont\nPittsburgh, PA 15216",   "longitude": -80.0350906,  "business_stars": 3.5, "latitude": 40.3942666},
          {"business_id": "3", "full_address": "3239 W Liberty Ave\nDormont\nPittsburgh, PA 15216", "longitude": -80.0409102,  "business_stars": 3.5, "latitude": 40.3897336},
          {"business_id": "4", "full_address": "345 6th Ave\nShadyside\nPittsburgh, PA 15222",   "longitude": -79.928437,  "business_stars": 2.5, "latitude": 40.458139},
          {"business_id": "5", "full_address": "601 South College Street\nUptown\nCharlotte, NC 28202",   "longitude": -80.8473977,  "business_stars": 3.5, "latitude": 35.2215512}
    ])
  );
};
