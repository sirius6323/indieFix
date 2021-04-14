// Import Express, Morgan, bodyParser, methodOverride
const express = require('express'),
	morgan = require('morgan'),
	app = express(),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

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

// Morgan logs url to terminal
app.use(morgan('common'));

// Serves static documentation of indieFix
app.use(express.static('public'));

// Error handling middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(methodOverride());

// GET requests
app.get('/', (req, res) => {
	res.send('Welcome to indieFix!');
});

app.get('/movies', (req, res) => {
	res.json(top10Movies);
});

app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500).send('You broke something!!! Call me to fix it.');
});

// Listens for requests
app.listen(8080, () => {
	console.log('indieFix API is listening on port 8080');
});
