const io = require("socket.io")(8080, {
  	path: "/stream",
});

io.on("connection", (socket) => {
	socket.emit("hello", "world");
});