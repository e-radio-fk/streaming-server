import io from "socket.io-client";

// const socket = io("https://e-radio-fk-server-zzhqz.ondigitalocean.app/streaming-server/stream");
// const socket = io("http://127.0.0.1:8081");

// socket.on("hello", (...args) => {
//     console.log(args);
// });

// for now just attach a handler to the play-button

var play_button = document.getElementsByClassName('play-button');

play_button.addEventListener('onclick', event => {
    event.preventDefault()

    var livechat_box = document.getElementById('live-chat-container');
    livechat_box.style.visibility = 'visible';
});