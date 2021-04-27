/*
Requirements 
1. Return a list of all movies to the user - (Done)
2. Return all the data of a single movie by the title to the user - (Done)
3. Return data about a Genre & (Description) by Name (e.g., "Thriller")
4. Return data about a Director (bio, birth year, death year) by name 
5. Allow new users to register
6. Allow users to update their user info (username, password, email, date of birth)
7. Allow users to add a movie to their list of favorites 
8. Allow users remove a movie from their list of favorites
9. Allow existing users to deregister 
*/

// Import Mongoose, models.js file, Express, Morgan, bodyParser,
const mongoose = require('mongoose'),
	Models = require('./models.js'),
	express = require('express'),
	morgan = require('morgan'),
	app = express(),
	bodyParser = require('body-parser');

// Model variables
const Movies = Models.Movie;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

// Connects to indieFixDB
mongoose.connect('mongodb://localhost:27017/indieFixDB', {
	useNewURLParser: true,
	useUnifiedTopology: true,
});

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

// GET Request, Welcome message to the user
app.get('/', (req, res) => {
	res
		.status(200)
		.send(
			'Welcome to indieFix! Get comfy, grab your snacks, drinks, and get ready for your Indie Fix with these movies.'
		);
});

// GET Request, Return a list of all movies to the user
app.get('/movies', (req, res) => {
	Movies.find()
		.then((allMovies) => {
			res.status(201).json(allMovies);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send(`Error: ${error}`);
		});
});

// GET Request, Return a single movie by Title to the user
app.get('/movies/:Title', (req, res) => {
	Movies.findOne({ Title: req.params.Title })
		.then((singleMovie) => {
			res.status(201).json(singleMovie);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send(`Error: ${error}`);
		});
});

// GET Request, Returns data about a single Genre by Name to the user
app.get('/movies/Genre/:Name', (req, res) => {
	Genres.findOne({ 'Genre.Name': req.params.Name })
		.then((singleGenre) => {
			res.status(201).json(singleGenre);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send(`Error: ${error}`);
		});
});

// GET Request, Returns data about a single Director by Name to the user
app.get('/movies/Director/:Name', (req, res) => {
	Directors.findOne({ 'Director.Name': req.params.Name })
		.then((singleDirector) => {
			res.status(201).json(singleDirector);
		})
		.catch((error) => {
			res.status(500).send(`Error: ${error}`);
		});
});

// GET Request, Allows Admin to view all registered Users in database
app.get('/users', (req, res) => {
	Users.find()
		.then((users) => {
			res.status(201).json(users);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send(`Error: ${error}`);
		});
});

// GET Request, Allows Admin to view a registered User by Username in database
app.get('/users/:Username', (req, res) => {
	Users.findOne({ Username: req.params.Username })
		.then((user) => {
			res.status(201).json(user);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send(`Error: ${error}`);
		});
});

// POST Request, Allows new users to register
app.post('/users', (req, res) => {
	Users.findOne({ Username: req.body.Username })
		.then((user) => {
			if (user) {
				return res
					.status(400)
					.send(
						`The UserName "${req.body.Username}" has already been taken by someone else.`
					);
			} else {
				Users.create({
					FirstName: req.params.FirstName,
					LastName: req.params.LastName,
					Birthday: req.params.Birthday,
					Username: req.params.Username,
					Password: req.params.Password,
					Email: req.params.Email,
				})
					.then((user) => {
						res.status(201).json(user);
					})
					.catch((error) => {
						console.error(error);
						res.status(500).send(`Error: ${error}`);
					});
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send(`Error: ${error}`);
		});
});

// POST Request, Allows Users to add a movie to their "Favorites" list by movie ID
app.post('/users/:Username/FavoriteMovies/:MovieID', (req, res) => {
	Users.findOneAndUpdate(
		{
			Username: req.params.Username,
		},
		{ $addToSet: { FavoriteMovies: req.params.MovieID } },
		{ new: true }
	)
		.then((userFavMovie) => {
			res.status(201).json(userFavMovie);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send(`Error: ${error}`);
		});
});

// POST Request, Allows Users to add a movie to their "Watch List" by movie ID
app.post('/users/:Username/WatchList/:MovieID', (req, res) => {
	Users.findOneAndUpdate(
		{
			Username: req.params.Username,
		},
		{ $addToSet: { WatchMovieList: req.params.MovieID } },
		{ new: true }
	)
		.then((userWatchMovie) => {
			res.status(201).json(userWatchMovie);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send(`Error: ${error}`);
		});
});

// PUT Request, Allows Users to update their account by Username
app.put('/users/:Username', (req, res) => {
	Users.findOneAndUpdate(
		{
			Username: req.params.Username,
		},
		{
			$set: {
				FirstName: req.params.FirstName,
				LastName: req.params.LastName,
				Birthday: req.params.Birthday,
				Username: req.params.Username,
				Password: req.params.Password,
				Email: req.params.Email,
			},
		}
	)
		.then((user) => {
			res.status(201).json(user);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send(`Error: ${error}`);
		});
});

// Delete Requests
// Delete movie from users Favorite List
app.delete('/users/:Username/movies/FavoriteMovies', (req, res) => {
	let movieFavTitle = req.body;
	res
		.status(201)
		.send(
			`DELETE request successful removing ${movieFavTitle.FavoriteMovies} from your favorite list.`
		);
});

// Delete movie from users Watch List
app.delete('/users/:Username/movies/WatchList', (req, res) => {
	let watchMovieTitle = req.body;
	res
		.status(201)
		.send(
			`DELETE request successful removing ${watchMovieTitle.WatchMovieList} from your favorite list.`
		);
});

// Delete user from database
app.delete('/users/:Username', (req, res) => {
	let deleteUser = req.params.Username;

	res
		.status(201)
		.send(
			`DELETE request successful deregistering ${deleteUser} from indieFix.`
		);
});

// Listens for requests
app.listen(8080, () => {
	console.log('indieFix API is listening on port 8080');
});
