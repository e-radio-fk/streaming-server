//
// This is site's main
//

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/docs'));

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

console.log('[1] Enabling stream.io...');

io.on("connection", (socket) => {
	socket.on('client-message', (...args) => {
		// console.log('got a message from a client!');
		io.emit('message', args[0], args[1], args[2]);
	});

	// got microphone data from the console; broadcast to all clients!
	socket.on('console-mic-chunks', data => {
		io.emit('microphone-data-chunk', data);
	})
});

server.listen(3000);