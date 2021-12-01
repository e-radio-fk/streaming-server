//
// This is site's main
//

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ss = require('socket.io-stream');

app.use(express.static(__dirname + '/docs'));

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

console.log('[1] Enabling stream.io...');

io.on("connection", (socket) => {

	/*
	 * Incase the music-playback-streaming must stop
	 *  set this flag to remove the respective Interval.
	 */
	var stop_music_playback_interval = false;

	socket.on('client-message', (...args) => {
		io.emit('message', args[0], args[1], args[2]);
	});

	socket.on('console-mic-chunks', data => {
		io.emit('microphone-data-chunk', data);
	});

	ss(socket).on('MUSIC_TRACK_STREAM', (stream, data) => {
		console.log('server: started music track stream!');

		parts = [];
	
		socket.on('data', (chunk) => {
			console.log('server: getting music chunks!');
			parts.push(chunk);
		});

		/* Set this inteval to play music streamed from the server every 4secs */
		var musicPlaybackInterval = setInterval(() => {
			if (parts.length > 0) 
			{
				/* send our newest chunks */
				io.emit('MUSIC_TRACK_PART', parts);
			}

			if (stop_music_playback_interval)
			{
				clearInterval(musicPlaybackInterval);
				stop_music_playback_inteval = false;
			}
		}, 4000);   // every 4 secs play music data!
	});

	socket.on('MUSIC_TRACK_STOP', () => {
		stop_music_playback_interval = true;
		io.emit('MUSIC_TRACK_STOP');
	});

	socket.on('MUSIC_TRACK_VOLUME', newVolume => {
		io.emit('MUSIC_TRACK_VOLUME', newVolume);
	});
});

server.listen(3000);