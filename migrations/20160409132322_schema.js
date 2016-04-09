
exports.up = function(knex, Promise) {
  
  Promise.all([
    knex.schema.createTable('business', function(table){
      table.string('business_id').primary();
      table.string('business_name');
      table.string('review_count');
      table.string('full_address');
      table.string('longitude');
      table.string('latitude');
      table.string('business_stars');
    }),
    knex.schema.createTable('reviews', function(table){
      table.string('review_id').primary();
      table.integer('review_stars');
      table.string('review_text');
      table.date('review_date');
      table.string('business_id_fk').references('business_id').inTable('business');
    })
  ]);
};

exports.down = function(knex, Promise) {
  Promise.all([
    knex.schema.dropTable('business'),
    knex.schema.dropTable('reviews'),
    knex.schema.dropTable('businessReviews')
  ]);
};
