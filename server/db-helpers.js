var config = require('../knexfile.js');
var env = process.env.NODE_ENV || 'development';
var knex = require('knex')(config[env]);

//can select by business
exports.selectAllReviews = function(business) {
  return exports.selectBusinessID(business)
              .then(function(busID){
                return knex.select('*')
                            .from('reviews')
                            .where('business_id_fk', busID);
              })
              .then(function(reviews){
                console.log('reviews', reviews);
                return reviews;
              })
              .catch(function(err){
                console.error('OH NO, ERROR in selectAllReviews', err);
                throw err;
              });
};

//can select by both business & date
exports.selectByDate = function(business, dateRange) {
  return exports.selectBusinessID(business)
                .then(function(busID){
                  return knex.select('*')
                              .from('reviews')
                              .where('business_id_fk', busID)
                              .andWhereBetween('date', dateRange);
                })
                .then(function(reveiws){
                  console.log('reviews', reviews);
                  return reviews;
                })
                .catch(function(err){
                  console.error('NOPE, ERROR in selectByDate', err);
                  throw err;
                });
};


exports.selectBusinessID = function(business) {
  return knex.select('business_id')
              .from('business')
              .where('business_name', business)
              .then(function(busID){
                console.log('business_id', busID);
                return busID[0];
              })
              .catch(function(err){
                console.error('OH ME OH MY, ERROR in selectBusinessID', err);
                throw err;
              });
};

exports.selectBusiness = function(business) {
  return knex.select('*')
              .from('business')
              .where('business_name', business)
              .then(function(business){
                console.log('business info', business);
                return business[0];
              })
              .catch(function(err){
                console.error('OH NO, ERROR in selectBusiness', err);
                throw err;
              });
};


exports.selectByStars = function(business, stars) {
  return exports.selectBusinessID(business)
                .then(function(busID){
                  return knex.select('*')
                            .from('reviews')
                            .whereBetween('review_stars', stars);
                })
                .then(function(reviews){
                  console.log('got reviews', reviews);
                  return reviews;
                })
                .catch(function(err){
                  console.error('WHOOPS, ERROR in selectByStars', err);
                  throw err;
                });
};
