const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "AXXXXXXXXXX",
    host: "localhost",
    database: "reformation_month"
    }
);

module.exports = pool;
