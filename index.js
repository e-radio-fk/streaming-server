// TODO: do not allow every origin! see CORS.

import { createServer, staticProvider } from 'express';

var app = createServer();

app.use(staticProvider(__dirname + '/public'));

app.all('*', function(req, res) {
  res.sendFile('index.html');
});

// const io = require("socket.io")(8081, {
// 	cors: {
// 		origin: '*',
// 	}
// });

// io.on("connection", (socket) => {
// 	socket.emit("hello", "world");
// });