// socket: created inside console-microphone.js and used here!

/* toggle music button */
var toggleMusicButton = document.getElementById('toggle-music-button');
toggleMusicButton.setAttribute('on', 'no');

function startMusic()
{
    var song = 'blah';
    console.log('console: starting song!');
    socket.emit('MUSIC_TRACK_START', song);
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