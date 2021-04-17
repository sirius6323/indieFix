/*
Requirements 
1. Return a list of all movies to the user - (Done)
2. Return all the data of a single movie by the title to the user - (Done)
3. Return data about a Genre (Description) by name/title (e.g., "Thriller")
4. Return data about a Director (bio, birth year, death year) by name 
5. Allow new users to register
6. Allow users to update their user info (username, password, email, date of birth)
7. Allow users to add a movie to their list of favorites 
8. Allow users remove a movie from their list of favorites
9. Allow existing users to deregister 
*/

// Import Express, Morgan, bodyParser,
const express = require('express'),
	morgan = require('morgan'),
	app = express(),
	bodyParser = require('body-parser');

// Movies array to test functionality
let movies = [
	{
		Title: 'Get Out',
		Description: '',
		Genre: 'Horror, Mystery, Thriller',
		Director: 'Jordan Peele',
		Image: '',
	},
	{
		Title: 'Parasite',
		Description: '',
		Genre: 'Comedy, Drama, Thriller',
		Director: 'Bong Joon-ho',
		Image: '',
	},
	{
		Title: 'Momento',
		Description: '',
		Genre: 'Mystery, Thriller',
		Director: 'Christoper Nolan',
		Image: '',
	},
	{
		Title: 'The Blair Witch Project',
		Description: '',
		Genre: 'Horror, Mystery',
		Director: 'Eduardo Sanchez, Daniel Myrick',
		Image: '',
	},
	{
		Title: 'Lost In Translation',
		Description: '',
		Genre: 'Comedy, Drama',
		Director: 'Sofia Coppola',
		Image: '',
	},
	{
		Title: 'Donnie Darko',
		Description: '',
		Genre: 'Drama, Mystery, Sci-Fi, Thriller',
		Director: 'Richard Kelly',
		Image: '',
	},
	{
		Title: 'Reservoir Dogs',
		Description: '',
		Genre: 'Crime, Drama, Thriller',
		Director: 'Quentin Tarantino',
		Image: '',
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
	res.status(200).send('Welcome to indieFix!');
});

// Gets the list of data about all movies
app.get('/movies', (req, res) => {
	res.status(200).json(movies);
});

// Gets the data of a single movie, by Title
app.get('/movies/:Title', (req, res) => {
	res.json(
		movies.find((movie) => {
			return movie.Title === req.params.Title;
		})
	);
});

// Gets the data of a genre by movie Title
app.get('/movies/:Genre/', (req, res) => {
	res.json(
		movies.find((movie) => {
			return movie.Genre === req.params.Genre;
		})
	);
});

// Listens for requests
app.listen(8080, () => {
	console.log('indieFix API is listening on port 8080');
});
