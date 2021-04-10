// Imports http, url, and fs modules
const http = require('http'),
	fs = require('fs'),
	url = require('url');

/* http module sets up the server
	 url module to retrieve URL request from the user
	 fs module to retrieve the appropriate file
*/

http
	.createServer((request, response) => {
		let address = request.url,
			analyze = url.parse(address, true),
			filePath = '';

		/* Tracks requests made to server, adds URL visited,
			and adds a timestamp to the request that was received  
		*/
		fs.appendFile(
			'log.txt',
			'URL: ' + address + '\nTimestamp: ' + new Date() + '\n\n',
			(error) => {
				if (error) {
					console.log(error);
				} else {
					console.log('Entry added to log.');
				}
			}
		);

		if (analyze.pathname.includes('documentation')) {
			filePath = __dirname + '/documentation.html';
		} else {
			filePath = 'index.html';
		}

		fs.readFile(filePath, (error, data) => {
			if (error) {
				throw error;
			}

			response.writeHead(200, { 'Content-Type': 'text/html' });
			response.write(data);
			response.end();
		});
	})
	.listen(8080);

console.log('This is my first Node test server and its running on Port 8080.');
