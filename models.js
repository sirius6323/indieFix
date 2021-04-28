const mongoose = require('mongoose');

// Movie Schema
const movieSchema = mongoose.Schema({
	Title: { type: String, required: true },
	Description: { type: String, required: true },
	Genre: {
		Name: String,
		Description: String,
	},
	Director: {
		Name: String,
		Bio: String,
		Birth: String,
	},
	ImagePath: String,
	Featured: Boolean,
});

// User Schema
const userSchema = mongoose.Schema({
	FirstName: { type: String, required: true },
	LastName: { type: String, required: true },
	Birthday: Date,
	Username: { type: String, required: true },
	Password: { type: String, required: true },
	Email: { type: String, required: true },
	FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
	WatchListMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
