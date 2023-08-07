const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[process.env.NODE.ENV || 'development']);

module.exports = knex;