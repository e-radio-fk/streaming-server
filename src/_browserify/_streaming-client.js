import io from "socket.io-client";

try
{
    /*
     *  Establish connection with the server
     */
    const socket = io.connect('/');

    /* the audio element */
    const musicAudioPlayback  = new Audio();
    musicAudioPlayback.volume = 0.2;

    //
    // play button
    //
    var play_button = document.getElementsByClassName('play-button')[0];
    if (!play_button)
    {
        throw new Error('Error getting play-button element!');
    }
    play_button.setAttribute('playing', 'no');

    //
    // attach a handler to the play-button
    //
    play_button.addEventListener('click', event => {
        if (play_button.getAttribute('playing') == 'yes') 
        {
            play_button.setAttribute('playing', 'no');
            play_button.style.backgroundImage = "url('../img/play.png')";

            // musicAudioPlayback.pause();
            // musicAudioPlayback.currentTime = 0;

            socket.removeAllListeners();
        }
        else if (play_button.getAttribute('playing') == 'no')
        {
            play_button.setAttribute('playing', 'yes');
            play_button.style.backgroundImage = "url('../img/pause.png')";

            const audio = document.createElement('audio');

            /*
             * upon receiving microphone data chunks we must play it (but only if the play-button is ON)
             * Warning: Browsers force us to have this handler inside the event-listener because of Autoplay
             */
            socket.on('server-sends-mic-chunks', (chunks) => {
                var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                audio.src = (window.URL ||  window.webkitURL).createObjectURL(blob);
                audio.play();

                // TODO: this should probably be planned to start in the future using the start(time) functionality...
            });
        }
    });
}
catch (e)
{
    console.error(e);
}