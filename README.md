# A disclaimer-
I didn't develop this project; it was developed by Will Ross DiFruscio (https://github.com/wdifruscio/seinfeld-api) 7 years ago and was outdated and broken, so I took it upon myself to make it into a functional project to use in a future project.
Currently, it is in production and can be found on this website: https://octopus-app-djbos.ondigitalocean.app/

# Seinfeld Quotes API

This is a simple Node.js API for serving Seinfeld quotes. The API allows users to fetch random quotes or search for quotes based on specific parameters.

## Features

- Get all quotes
- Get a random quote
- Get quotes based on a filter and a parameter (e.g., episode, character, etc.)
- Get a random quote based on a filter and a parameter (e.g., episode, character, etc.)

## Installation

Before running the API, please ensure you have Node.js and npm installed on your system.

1. Clone the repository:

```bash
git clone https://github.com/yourusername/seinfeld-quotes-api.git
```

2. Install dependencies:

```bash
cd seinfeld-quotes-api
npm install
```

3. Create a `config.js` file in the root folder with the following content:

```javascript
const CONFIG = {
	URL: "mongodb://localhost:27017/database-name", // Replace "database-name" with your desired database name
};

module.exports = {
	CONFIG,
};
```

Replace `database-name` with the actual name of your MongoDB database.

4. Start the server:

```bash
node server.js
```

## Usage

Once the server is running, you can use the following endpoints:

1. Get all quotes:

```
GET localhost:3000/quotes
```

2. Get a random quote:

```
GET localhost:3000/random
```

3. Get quotes based on a filter and a parameter:

```
GET localhost:3000/:filter/:id
```

Example:

```
GET localhost:3000/episode/TheSoup
```

4. Get a random quote based on a filter and a parameter:

```
GET localhost:3000/:filter/:id/random
```

Example:

```
GET localhost:3000/author/Jerry/random
```

## License
All right reserved to Will Ross DiFruscio on the original development.
This project is licensed under the MIT License.
