const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "AmorDei@2011",
    host: "localhost",
    database: "reformation_month"
    }
);

module.exports = pool;