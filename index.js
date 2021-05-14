//
// This is site's main
//

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server)

app.use(express.static(__dirname + '/docs'));

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

// app.get('/enable-streaming', (req, res) => {
// });

console.log('[1] Enabling stream.io...');

io.on("connection", (socket) => {
	socket.on('client-message', (...args) => {
		console.log('got a message from a client!');
		io.emit('message', args[0], args[1], args[2]);
	});
});

server.listen(3000);