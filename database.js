'use strict';

const initOptions = {
  query(e) {
    console.log('\x1b[31m%s\x1b[0m', e.query); //red terminal
  }
};
const pgp = require('pg-promise')(initOptions);

const cn = {
  host: '',
  port: 5432,
  database: '',
  user: '',
  password: '',
  ssl: true
};

let db = pgp(cn);

module.exports = db;