"use strict";

const express = require("express");
const app = express();
const seinfeld = require("./seinfeld").quotes;
const MongoClient = require("mongodb").MongoClient;
const config = require("./config").CONFIG;
const port = process.env.PORT || 8080;

const connectDB = async () => {
  try {
    const client = await MongoClient.connect(config.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return client.db();
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    return null;
  }
};

const getQuotesCollection = async (db) => db.collection("quotes");

const saveFromJSON = async () => {
  const db = await connectDB();
  if (!db) return;
  else {
    const quotesCollection = await getQuotesCollection(db);
    const quotes = await quotesCollection.find({}).toArray();
    if (quotes.length === 0) {
      await quotesCollection.insertMany(seinfeld);
    }
  }
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", express.static(__dirname + "/public"));

app.get("/quotes", async (req, res) => {
  const db = await connectDB();
  const quotesCollection = await getQuotesCollection(db);
  const quotes = await quotesCollection.find({}).toArray();
  res.send(quotes);
});

app.get("/random", async (req, res) => {
  const db = await connectDB();
  const quotesCollection = await getQuotesCollection(db);
  const quotes = await quotesCollection.find({}).toArray();
  res.send(quotes[Math.floor(Math.random() * quotes.length)]);
});

app.get("/:filter/:id", async (req, res) => {
	const db = await connectDB();
	const quotesCollection = await getQuotesCollection(db);
	const quotes = await quotesCollection
		.find({
			[req.params.filter]:
				req.params.id.charAt(0).toUpperCase() + req.params.id.slice(1),
		})
		.toArray();

	if (quotes.length === 0) {
		res.status(500).send("Sorry, parameters provided are not valid");
	} else {
		res.send(quotes);
	}
});

app.get("/:filter/:id/random", async (req, res) => {
	const db = await connectDB();
	const quotesCollection = await getQuotesCollection(db);
	const quotes = await quotesCollection
		.find({
			[req.params.filter]:
				req.params.id.charAt(0).toUpperCase() + req.params.id.slice(1),
		})
		.toArray();

	if (quotes.length === 0) {
		res.status(500).send("Sorry, parameters provided are not valid");
	} else {
		res.send(quotes[Math.floor(Math.random() * quotes.length)]);
	}
});

app.use("*", (req, res) => {
	res.status(404).send("Sorry, the page you are looking for does not exist");
});

app.listen(port, function () {
	console.log("App listening on port!");
});

// Call the function to save the Seinfeld quotes to the database
saveFromJSON();
