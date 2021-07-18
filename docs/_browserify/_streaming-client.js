import io from "socket.io-client";

try
{
    var play_button = document.getElementsByClassName('play-button')[0];
    if (!play_button)
    {
        throw new Error('Error getting play-button element!');
    }

    play_button.setAttribute('playing', 'no');
    
    // attach a handler to the play-button
    play_button.addEventListener('click', event => {        
        if (play_button.getAttribute('playing') == 'yes') 
        {
            play_button.setAttribute('playing', 'no');
            play_button.style.backgroundImage = "url('../img/play.png')";

            socket.on("microphone-data-chunk", (data) => {
                // do nothing!
            });
        }
        else if (play_button.getAttribute('playing') == 'no')
        {
            play_button.setAttribute('playing', 'yes');
            play_button.style.backgroundImage = "url('../img/pause.png')";

            /*
             *  Establish connection with the server
             */
            const socket = io.connect('/');

            var audio = document.createElement('audio');
            audio.setAttribute('muted', 'muted');

            /* 
             * upon receiving a microphone data chunk we must play it (but only if the play-button is ON)
             * Warning: Browsers force us to have this handler inside the event-listener because of Autoplay
             */
            socket.on("microphone-data-chunk", (arrayBuffer) => {
                audio.src = (window.URL || window.webkitURL).createObjectURL(new Blob(arrayBuffer));
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