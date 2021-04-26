// index.js

const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const AWS = require("aws-sdk");

const ENTRYLOGS_TABLE = process.env.ENTRYLOGS_TABLE;
const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = "localhost";
  dynamoDbClientParams.endpoint = "http://localhost:8000";
}
const dynamoDb = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);

app.use(bodyParser.json({ strict: false }));

app.get("/", function (req, res) {
  res.send(`Hello World! Request \n\nreceived: ${req.method} - ${req.path}`);
});

// Get Entry Log Endpoint
app.get("/entrylogs/:entrylogID", function (req, res) {
  const params = {
    TableName: ENTRYLOGS_TABLE,
    Key: {
      entrylogID: req.params.entrylogID,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not get entry log" });
    }
    if (result && result.Item) {
      const { entrylogID, name } = result.Item;
      res.json({ entrylogID, name });
    } else {
      res.status(404).json({ error: "Entry Log not found" });
    }
  });
});

// Get all users endpoint
app.get("/entrylogs/", function (req, res) {
  const params = {
    TableName: ENTRYLOGS_TABLE,
    Limit: 3000,
  };

  dynamoDb.scan(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not get all entry logs" });
    }
    if (result) {
      res.json(result);
    }
  });
});

// Create Entry Log Endpoint
app.post("/entrylogs", function (req, res) {
  const { entrylogID, name } = req.body;
  if (typeof entrylogID !== "string") {
    res.status(400).json({ error: '"entrylogID" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: ENTRYLOGS_TABLE,
    Item: {
      entrylogID: entrylogID,
      name: name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not create entry log" });
    }
    res.json({ entrylogID, name });
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send("Internal Serverless Error");
});

module.exports.handler = serverless(app);
