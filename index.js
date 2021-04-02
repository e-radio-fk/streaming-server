// TODO: do not allow every origin! see CORS.

const io = require("socket.io")(8081, {
	cors: {
		origin: '*',
	}
});

io.on("connection", (socket) => {
	socket.emit("hello", "world");
});