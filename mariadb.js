const mariadb = require("mysql2");

// create the connection to database
const connection = mariadb.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "BookShop",
  port: 3307,
  dateStrings: true,
});

module.exports = connection;

// simple query
