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

// Movie Genre Schema
const genreSchema = mongoose.Schema({
	Name: { type: String, required: true },
	Description: { type: String, required: true },
});

// Movie Director Schema
const directorSchema = mongoose.Schema({
	Name: { type: String, required: true },
	Bio: String,
	Birth: { type: Number, required: true },
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
const Genre = mongoose.model('Genre', genreSchema);
const Director = mongoose.model('Director', directorSchema);
const User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.User = User;
