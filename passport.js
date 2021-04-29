const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	Models = require('./models.js'),
	passportJWT = require('passport-jwt');

let Users = Models.User,
	JWTStrategy = passportJWT.Strategy,
	ExtractJWT = passportJWT.ExtractJwt;

// HTTP authentication for login requests
passport.use(
	new LocalStrategy(
		{
			usernameField: 'Username',
			passwordField: 'Password',
		},
		(username, password, callback) => {
			console.log(username + ' ' + password);
			Users.findOne({ Username: username }, (error, user) => {
				if (error) {
					console.log(error);
					return callback(error);
				}

				if (!user) {
					console.log('Incorrect Username');
					return callback(null, false, {
						message: 'Incorrect Username',
					});
				}

				console.log('Finished');
				return callback(null, user);
			});
		}
	)
);

// JWT Token Authentication, authenticates Users on token submitted with their requests
passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: 'your_jwt_secret',
		},
		(jwtPayload, callback) => {
			return Users.findById(jwtPayload._id)
				.then((user) => {
					return callback(null, user);
				})
				.catch((error) => {
					return callback(error);
				});
		}
	)
);
