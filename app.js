// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// // var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// // app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
"use strict";

const express = require("express");
const app = express();
const seinfeld = require("./seinfeld").quotes;
const MongoClient = require("mongodb").MongoClient;
const config = require("./config").CONFIG;
const port = process.env.PORT || 3000;

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
		//will check if the collection is empty and if it is, it will insert the data
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

app.use("/", express.static(__dirname + "/mainpage"));

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

app.use("*", express.static(__dirname + "/404"));

app.listen(port, function () {
	console.log("App listening on port!");
});

// Call the function to save the Seinfeld quotes to the database
saveFromJSON();