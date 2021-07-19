import io from "socket.io-client";

try
{
    /*
     *  Establish connection with the server
     */
    const socket = io.connect('/');

    var play_button = document.getElementsByClassName('play-button')[0];
    if (!play_button)
    {
        throw new Error('Error getting play-button element!');
    }

    play_button.setAttribute('playing', 'no');

    /* the audio element */
    var audio = document.createElement('audio');

    // attach a handler to the play-button
    play_button.addEventListener('click', event => {
        if (play_button.getAttribute('playing') == 'yes') 
        {
            play_button.setAttribute('playing', 'no');
            play_button.style.backgroundImage = "url('../img/play.png')";

            audio.pause();
            audio.currentTime = 0;
            socket.removeAllListeners();
        }
        else if (play_button.getAttribute('playing') == 'no')
        {
            play_button.setAttribute('playing', 'yes');
            play_button.style.backgroundImage = "url('../img/pause.png')";

            /*
             * upon receiving microphone data chunks we must play it (but only if the play-button is ON)
             * Warning: Browsers force us to have this handler inside the event-listener because of Autoplay
             */
            socket.on("microphone-data-chunk", (recordedChunks) => {
                audio.src = (window.URL || window.webkitURL).createObjectURL(new Blob(recordedChunks));
                audio.play();
                console.log('playing!');
            });
        }
    });
}
catch (e)
{
    console.error(e);
}