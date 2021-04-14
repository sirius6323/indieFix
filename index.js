// Import Express
const express = require('express'),
	app = express();

// Top 10 Movies
let top10Movies = [
	{
		title: 'Get Out',
		director: 'Jordan Peele',
	},
	{
		title: 'Parasite',
		director: 'Bong Joon Ho',
	},
	{
		title: 'Momento',
		director: 'Christoper Nolan',
	},
	{
		title: 'The Blair Witch Project',
		director: 'Eduardo Sanchez, Daniel Myrick',
	},
	{
		title: 'Reservoir Dogs',
		director: 'Quentin Tarantino',
	},
];

// GET requests
app.get('/movies', (req, res) => {
	res.json(top10Movies);
});
