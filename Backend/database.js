const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Vinay@123",
  database: "postgres",
});

client.connect();

client.query(`SELECT * FROM customers`, (err, res) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(res.rows);
  }
  client.end();
});
