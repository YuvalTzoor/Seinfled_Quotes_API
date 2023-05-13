//will add the process.env.MONGODB_URL to the config.js file
// Path: config.js
// Compare this snippet from app.js:

var process = require("process");

const CONFIG = {
	URL: process.env.MONGODB_URL,
	// Replace "database-name" with your desired database name
};

module.exports = {
	CONFIG,
};

