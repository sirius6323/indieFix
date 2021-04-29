// Same key used in the JWTStrategy
const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
	passport = require('passport');

// Local passport file
require('./passport');

let generateJWTToken = (user) => {
	return jwt.sign(user, jwtSecret, {
		// The Username thats encoding in the JWT
		subject: user.Username,
		// Specifies that the token will expire in 7 days
		expiresIn: '7d',
		// Algorithm used to "sign" or encode values of the JWT
		algorithm: 'HS256',
	});
};

/* POST Login */
module.exports = (router) => {
	router.post('/login', (req, res) => {
		passport.authenticate('local', { session: false }, (error, user, info) => {
			if (error || !user) {
				return res
					.status(400)
					.json({ message: 'Something went wrong', user: user });
			}
			req.login(user, { session: false }, (error) => {
				if (error) {
					res.send(error);
				}
				let token = generateJWTToken(user.toJSON());
				return res.json({ user, token });
			});
		})(req, res);
	});
};
