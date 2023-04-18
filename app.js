const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

var { Client } = require("pg");

require("dotenv").config();

const env = process.env;
console.log(env.DATABASE_NAME);

const client = new Client({
  user: env.USER_NAME,
  host: env.HOST,
  database: env.DATABASE_NAME,
  password: env.PASSWORD,
  post: env.POSTGRE_PORT,
});

app.get("/", (req, res) => {
  console.log("req.body: ");
  console.log(req.body);

  (async () => {
    try {
      const connection = await client.connect();

      await client.query(`DROP DATABASE IF EXISTS ${env.DATABASE_NAME};`);
      await client.query(`CREATE DATABASE ${env.DATABASE_NAME};`);

      await client.query(
        `CREATE TABLE ${env.TABLE_NAME}(id SERIAL PRIMARY KEY, value VARCHAR NOT NULL);`
      );

      const value = "val1";

      await insertRecords(connection, value);

      console.log("insert終了");
    } catch (e) {
      console.log("e: " + e);
    } finally {
      client.end();
    }
  })();
});

app.get("/select", (req, res) => {
  (async () => {
    try {
      const selectResult = await selectRecords(connection);

      console.log("selectResult: " + selectResult);
      console.log("select終了");
    } catch (e) {
      console.log("e: " + e);
    } finally {
      client.end();
    }
  })();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

async function insertRecords(connection, value) {
  return await new Promise(function(resolve, reject) {
    connection.query(
      `INSERT IGNORE INTO ${env.TABLE_NAME} (value) VALUES ?;`,
      value,
      (err, rows, fields) => {
        if (err) {
          console.log("err: ");
          console.log(err);
          console.log("err.code: ");
          console.log(err.code);

          reject(err);
        }

        console.log("rows: ");
        console.log(rows);

        resolve();
      }
    );
  });
}

async function selectRecords(connection) {
  return await new Promise(function(resolve, reject) {
    connection.query(
      `SELECT * from ${env.TABLE_NAME};`,
      (err, rows, fields) => {
        if (err) {
          console.log("err: ");
          console.log(err);
          console.log("err.code: ");
          console.log(err.code);

          reject(err);
        }

        console.log("rows: ");
        console.log(rows);

        resolve();
      }
    );
  });
}
