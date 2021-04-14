// Import Express
const express = require('express'),
	app = express();

// GET requests
app.get('/', (req, res) => {
	res.send('Welcome to indieFix!');
});

app.get('/movies', (req, res) => {
	res.json(top10Movies);
});
