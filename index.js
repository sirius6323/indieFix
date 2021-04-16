// Import Express, Morgan, bodyParser,
const express = require('express'),
	morgan = require('morgan'),
	app = express(),
	bodyParser = require('body-parser');

// Movies array to test functionality
let movies = [
	{
		title: 'Get Out',
		director: 'Jordan Peele',
	},
	{
		title: 'Parasite',
		director: 'Bong Joon-ho',
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
		title: 'Lost In Translation',
		director: 'Sofia Coppola',
	},
	{
		title: 'Donnie Darko',
		director: 'Richard Kelly',
	},
	{
		title: 'Reservoir Dogs',
		director: 'Quentin Tarantino',
	},
];

// Morgan logs url to terminal
app.use(morgan('common'));

// Serves static documentation of indieFix
app.use(express.static('public'));

// Error handling middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use((err, req, res, next) => {
	console.log(err.stack);
	res
		.status(500)
		.send('The hosting server is broken or exploded!!! Call me to fix it.');
});

// GET requests
app.get('/', (req, res) => {
	res.send('Welcome to indieFix!');
});

// Gets the list of data about all movies
app.get('/movies', (req, res) => {
	res.json(movies);
});

// Gets the data of a single movie, by title
app.get('/movies/:title', (req, res) => {
	res.json(
		movies.find((movie) => {
			return movie.title === req.params.title;
		})
	);
});

// Listens for requests
app.listen(8080, () => {
	console.log('indieFix API is listening on port 8080');
});
