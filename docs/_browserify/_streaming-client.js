import io from "socket.io-client";

// attach a handler to the play-button

var play_button = document.getElementsByClassName('play-button')[0];

play_button.addEventListener('click', event => {
    event.preventDefault()

    if (play_button.getAttribute('on') == 'yes') 
        play_button.setAttribute('on', 'no');
    else if (microphoneButton.getAttribute('on') == 'no') 
        play_button.setAttribute('on', 'yes');
});

/*
 *  Establish connection with the server
 */
const socket = io.connect('/');

/* 
 * upon receiving a microphone data chunk we must play it (but only if the play-button is ON)
 */
socket.on("microphone-data-chunk", (arrayBuffer) => {
    var blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
    var audio = document.createElement('audio');
    audio.src = window.URL.createObjectURL(blob);
    audio.play();
});