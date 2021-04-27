const mongoose = require('mongoose');

// Movie Schema
let movieSchema = mongoose.Schema({
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
let userSchema = mongoose.Schema({
	FirstName: { type: String, required: true },
	LastName: { type: String, required: true },
	Birthday: Date,
	Username: { type: String, required: true },
	Password: { type: String, required: true },
	Email: { type: String, required: true },
	FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
	WatchListMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
