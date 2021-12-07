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

	//
	//	MICROPHONE PLAYBACK
	// 
	socket.on('console-mic-chunks', data => {
		io.emit('microphone-data-chunk', data);
	});

	// 
	//	MUSIC PLAYBACK
	// 
	socket.on('MUSIC_TRACK_FILENAME', filename => {
		io.emit('MUSIC_TRACK_FILENAME', filename);
	});

	/*
	 * Requesting Position Handler
	 *
	 * Δημιουργούμε έναν handler για την περίπτωση που οποιοσδήποτε client ζητά
	 *  να μάθει την position στο song για να ξεκινήσει να το παίζει.
	 */
	socket.on('MUSIC_TRACK_REQUESTING_POSITION', () => {
		socket.emit('MUSIC_TRACK_POSITION', 0.2);			// TODO: fixme
	});

	socket.on('MUSIC_TRACK_START_WITH_FILENAME', (filename) => {
		io.emit('MUSIC_TRACK_START_WITH_FILENAME', filename);
	});

	socket.on('MUSIC_TRACK_STOP', () => {
		io.emit('MUSIC_TRACK_STOP');
	});

	socket.on('MUSIC_TRACK_VOLUME', newVolume => {
		io.emit('MUSIC_TRACK_VOLUME', newVolume);
	});
});

server.listen(3000);