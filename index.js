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

	io.on("connection", (socket) => {
		socket.emit('message', 'hello from npyl!!!!', 'npyl');
	});

});

app.listen(3000, () =>
    console.log('Example app listening on port 3000!'),
);