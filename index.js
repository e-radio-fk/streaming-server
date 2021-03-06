const io = require("socket.io-client")(8080, {
    path: "/stream",
});

io.on("connection", (socket) => {
    socket.emit("hi", "everyone");
});

io.on("disconnect", (reason) => {
    console.log(reason);
});