import io from "socket.io-client";

// const socket = io("https://e-radio-fk-server-zzhqz.ondigitalocean.app/streaming-server/stream");
const socket = io("http://127.0.0.1:8081");

socket.on("hello", (...args) => {
    console.log(args);
});