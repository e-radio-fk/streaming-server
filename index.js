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
		io.emit('message', args[0], args[1], args[2]);
	});

	socket.on('console-mic-chunks', data => {
		io.emit('microphone-data-chunk', data);
	});

	socket.on('MUSIC_TRACK_START', song => {
		io.emit('MUSIC_TRACK_START', song);
	});

	socket.on('MUSIC_TRACK_STOP', () => {
		io.emit('MUSIC_TRACK_STOP');
	});

	socket.on('MUSIC_TRACK_VOLUME', newVolume => {
		io.emit('MUSIC_TRACK_VOLUME', newVolume);
	});
});

server.listen(3000);