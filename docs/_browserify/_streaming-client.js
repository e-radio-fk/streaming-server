import io from "socket.io-client";

try
{
    /* the audio element */
    const musicAudioPlayback  = new Audio();
    const musicAudioPlaybackSrc  = document.createElement("source");
    musicAudioPlaybackSrc.type = "audio/mpeg";

    const microphoneAudio = document.createElement('audio');

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

    // attach a handler to the play-button
    play_button.addEventListener('click', event => {
        if (play_button.getAttribute('playing') == 'yes') 
        {
            play_button.setAttribute('playing', 'no');
            play_button.style.backgroundImage = "url('../img/play.png')";

            microphoneAudio.pause();
            microphoneAudio.currentTime = 0;

            musicAudioPlayback.pause();
            musicAudioPlayback.currentTime = 0;

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
                microphoneAudio.src = (window.URL || window.webkitURL).createObjectURL(new Blob(recordedChunks));
                microphoneAudio.play();
            });

            socket.on('MUSIC_TRACK_START', song => {
                // TODO: must convert this to streaming capability!
                musicAudioPlaybackSrc.src  = "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3";
                musicAudioPlayback.appendChild(musicAudioPlaybackSrc);
                musicAudioPlayback.play();
            });

            socket.on('MUSIC_TRACK_STOP', () => {
                musicAudioPlayback.pause();
                musicAudioPlayback.currentTime = 0;
            });
            
            socket.on('MUSIC_TRACK_VOLUME', newVolume => {
                musicAudioPlayback.volume = newVolume / 100;
            });
        }
    });
}
catch (e)
{
    console.error(e);
}