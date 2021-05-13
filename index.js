//
// This is site's main
//

var express = require('express');

const app = express();

app.use(express.static(__dirname + '/docs'));

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.get('/enable-streaming', (req, res) => {
    console.log('[1] Enabling stream.io...');

	const io = require("socket.io")(8081, {
		cors: {
			origin: '*',
		}
	});

	// const io = require('socket.io')(3000, {});

	io.on("connection", (socket) => {
		socket.on('client-message', (...args) => {
			console.log('got a message from a client!');
			io.emit('message', args[0], args[1], args[2]);
		});
	});
});

app.listen(8081, () =>
    console.log('Example app listening on port 3000!'),
);