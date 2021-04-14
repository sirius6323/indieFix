// Import Express
const express = require('express'),
	morgan = require('morgan'),
	app = express();

// Movies array to test functionality
let top10Movies = [
	{
		title: 'Get Out',
		director: 'Jordan Peele',
	},
	{
		title: 'Parasite',
		director: 'Bong Joon-ho',
	},
];

// Logs URL of every request made to server
let logger = (req, res, next) => {
	console.log(req.url);
	next();
};

app.use(logger);

// GET requests
app.get('/', (req, res) => {
	res.send('Welcome to indieFix!');
});

app.get('/movies', (req, res) => {
	res.json(top10Movies);
});

// Listens for requests
app.listen(8080, () => {
	console.log('indieFix API is listening on port 8080');
});
