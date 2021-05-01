/*
Requirements 
1. Return a list of all movies to the user - (Done)
2. Return all the data of a single movie by the title to the user - (Done)
3. Return data about a Genre & (Description) by Name (e.g., "Thriller") - (Done)
4. Return data about a Director (Bio, Birth year, Death year) by Name - (Done)
5. Allow new users to register - (Done)
6. Allow users to update their user info (Username, Password, Email, Birthday) - (Done)
7. Allow users to add a movie to their list of favorites - (Done)
8. Allow users remove a movie from their list of favorites - (Done)
9. Allow existing users to deregister - (Done)
*/

// Integrates Mongoose with indieFix REST API
const mongoose = require('mongoose'),
	Models = require('./models.js'),
	passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

// Cors access (allowed domains)
const cors = require('cors');

// List of allowed domains
const allowedOrigins = [
	'http://localhost:8080',
	'http://localhost',
	'https://indiefix.herokuapp.com/',
];

// Imports Express and creates the server
const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser');

const app = express();

// Model schemas
const Movies = Models.Movie;
const Users = Models.User;

/* Connects to local indieFixDB
mongoose.connect('mongodb://localhost:27017/indieFixDB', {
	useNewURLParser: true,
	useUnifiedTopology: true,
});
*/

mongoose.connect(
	'mongodb+srv://indieFixDBadmin:ghostofyou35@indiefixdb.osrbj.mongodb.net/indieFixDB?retryWrites=true&w=majority',
	{
		useNewURLParser: true,
		useUnifiedTopology: true,
	}
);

// Morgan logs url to terminal
app.use(morgan('common'));

// Serves static documentation of indieFix
app.use(express.static('public'));

// Error handling middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const auth = require('./auth')(app);

// Allows access to indieFix API if domain in within allowedOrigins
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				let message = `The CORS policy for this application doesn't allow access from origin: ${origin}`;
				return callback(new Error(message), false);
			}
			return callback(null, true);
		},
	})
);

// Error handling middleware
app.use((err, req, res, next) => {
	console.log(err.stack);
	res
		.status(500)
		.send(
			'The hosting server is broken or exploded!!! Try again later when its operational.'
		);
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
app.get(
	'/movies',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.find()
			.then((allMovies) => {
				res.status(201).json(allMovies);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send(`Error: ${error}`);
			});
	}
);

// GET Request, Return a single movie by Title to the user
app.get(
	'/movies/:Title',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ Title: req.params.Title })
			.then((singleMovie) => {
				res.status(201).json(singleMovie);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send(`Error: ${error}`);
			});
	}
);

// GET Request, Returns data about a single Genre by Name to the user
app.get(
	'/movies/Genre/:Name',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ 'Genre.Name': req.params.Name })
			.then((movie) => {
				res.status(201).json(movie.Genre);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send(`Error: ${error}`);
			});
	}
);

// GET Request, Returns data about a single Director by Name to the user
app.get(
	'/movies/Director/:Name',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ 'Director.Name': req.params.Name })
			.then((movie) => {
				res.status(201).json(movie.Director);
			})
			.catch((error) => {
				res.status(500).send(`Error: ${error}`);
			});
	}
);

// GET Request, Allows Admin to view all registered Users in database
app.get(
	'/users',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.find()
			.then((users) => {
				res.status(201).json(users);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send(`Error: ${error}`);
			});
	}
);

// GET Request, Allows Admin to view a registered User by Username in database
app.get(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOne({ Username: req.params.Username })
			.then((user) => {
				res.status(201).json(user);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send(`Error: ${error}`);
			});
	}
);

// POST Request, Allows new users to register
app.post(
	'/users',
	// Validates entered information by the user
	[
		check('FirstName', 'Your first name is required').not().isEmpty(),
		check('LastName', 'Your last name is required').not().isEmpty(),
		check('Username', 'Username requires a minimum of 5 characters').isLength({
			min: 5,
		}),
		check(
			'Username',
			'Username only allows alphanumeric characters'
		).isAlphanumeric(),
		check(
			'Password',
			'Your password requires a minimum of 8 characters'
		).isLength({ min: 8 }),
		check('Email', 'Email does not appear to be valid').isEmail(),
	],
	(req, res) => {
		// Checks the validation object for errors
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const hashedPassword = Users.hashPassword(req.body.Password);

		Users.findOne({ Username: req.body.Username })
			.then((user) => {
				if (user) {
					return res
						.status(400)
						.send(
							`The Username "${req.body.Username}" has already been taken by someone else.`
						);
				} else {
					Users.create({
						FirstName: req.body.FirstName,
						LastName: req.body.LastName,
						Birthday: req.body.Birthday,
						Username: req.body.Username,
						Password: hashedPassword,
						Email: req.body.Email,
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
	}
);

// POST Request, Allows Users to add a movie to their "Favorites" list by movie ID
app.post(
	'/users/:Username/FavoriteMovies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
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
	}
);

// POST Request, Allows Users to add a movie to their "Watch List" by movie ID
app.post(
	'/users/:Username/WatchListMovies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
			{
				Username: req.params.Username,
			},
			{ $addToSet: { WatchListMovies: req.params.MovieID } },
			{ new: true }
		)
			.then((userWatchMovie) => {
				res.status(201).json(userWatchMovie);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send(`Error: ${error}`);
			});
	}
);

// PUT Request, Allows Users to update their account by Username
app.put(
	'/users/:Username',
	[
		check('FirstName', 'Your first name is required').not().isEmpty(),
		check('LastName', 'Your last name is required').not().isEmpty(),
		check('Username', 'Username requires a minimum of 5 characters').isLength({
			min: 5,
		}),
		check(
			'Username',
			'Username only allows alphanumeric characters'
		).isAlphanumeric(),
		check(
			'Password',
			'Your password requires a minimum of 8 characters'
		).isLength({ min: 8 }),
		check('Email', 'Email does not appear to be valid').isEmail(),
	],
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const hashedPassword = Users.hashPassword(req.body.password);

		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$set: {
					FirstName: req.body.FirstName,
					LastName: req.body.LastName,
					Birthday: req.body.Birthday,
					Username: req.body.Username,
					Password: hashedPassword,
					Email: req.body.Email,
				},
			},
			{ new: true }
		)
			.then((updatedUser) => {
				res.status(201).json(updatedUser);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send(`Error: ${error}`);
			});
	}
);

// DELETE Request, Allows Users to remove a movie from their "FavoriteMovie" list by movie ID
app.delete(
	'/users/:Username/FavoriteMovies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{ $pull: { FavoriteMovies: req.params.MovieID } },
			{ new: true }
		)
			.then((user) => {
				res.status(201).json(user);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send(`Error: ${error}`);
			});
	}
);

// DELETE Request, Allows Users to remove a movie from their "WatchList" by movie ID
app.delete(
	'/users/:Username/WatchListMovies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{ $pull: { WatchListMovies: req.params.MovieID } },
			{ new: true }
		)
			.then((user) => {
				res.status(201).json(user);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send(`Error: ${error}`);
			});
	}
);

// DELETE Request, Allows existing users to deregister by Username
app.delete(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndDelete({ Username: req.params.Username })
			.then((user) => {
				if (!user) {
					res
						.status(400)
						.send(
							`Username: "${req.params.Username}" was not found in the database.`
						);
				} else {
					res
						.status(200)
						.send(
							`The user with Username: "${req.params.Username}" has been deleted from the database`
						);
				}
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send(`Error: ${error}`);
			});
	}
);

// Port Listener
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
	console.log(`Listening on Port ${port}`);
});
