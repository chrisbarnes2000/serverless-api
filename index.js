// index.js

const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const AWS = require("aws-sdk");

const ENTRYLOGS_TABLE = process.env.ENTRYLOGS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

app.get("/", function (req, res) {
  res.send("Hello World!");
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
    if (result.Item) {
      const { entrylogID, name } = result.Item;
      res.json({ entrylogID, name });
    } else {
      res.status(404).json({ error: "Entry Log not found" });
    }
  });
});

// Create Entry Log Endpoint
app.post('/entrylogs', function (req, res) {
  const { entrylogID, name } = req.body;
  if (typeof entrylogID !== 'string') {
    res.status(400).json({ error: '"entrylogID" must be a string' });
  } else if (typeof name !== 'string') {
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
      res.status(400).json({ error: 'Could not create entry log' });
    }
    res.json({ entrylogID, name });
  });
})

module.exports.handler = serverless(app);
