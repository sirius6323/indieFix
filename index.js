// Import Express
const express = require('express'),
	morgan = require('morgan'),
	app = express();

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
