// socket: created inside console-microphone.js and used here!

/* toggle music button */
var toggleMusicButton = document.getElementById('toggle-music-button');
toggleMusicButton.setAttribute('on', 'no');

const musicAudioPlayback = new Audio();

function startMusic()
{
    var song = "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3";

    musicAudioPlayback.src = song;
    musicAudioPlayback.volume = 0;  // we do not actually play the song; this is a dummy!
    musicAudioPlayback.play();

    socket.emit('MUSIC_TRACK_START_WITH_FILENAME', song);
    console.log('console: starting song!');
}

function stopMusic()
{
    socket.emit('MUSIC_TRACK_STOP');
}

function toggle_music()
{
    if (toggleMusicButton.getAttribute('on') == 'yes')
    {
        stopMusic();
        toggleMusicButton.setAttribute('on', 'no');
        toggleMusicButton.innerHTML = 'start music';
    }
    else if (toggleMusicButton.getAttribute('on') == 'no') 
    {
        startMusic();
        toggleMusicButton.setAttribute('on', 'yes');
        toggleMusicButton.innerHTML = 'stop music';
    }
}

function change_volume(newVolume)
{
    socket.emit('MUSIC_TRACK_VOLUME', newVolume);
}