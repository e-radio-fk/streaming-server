// socket: created inside console-microphone.js and used here!

/* toggle music button */
var toggleMusicButton = document.getElementById('toggle-music-button');
toggleMusicButton.setAttribute('on', 'no');

function startMusic()
{
    console.log('console: starting song!');

    //
    // Create a new music playback stream
    //
    var musicStream = ss.createStream();
    var song = "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3";
    ss(socket).emit('MUSIC_TRACK_STREAM', musicStream, { name: song });
    ss.createBlobReadStream(song).pipe(musicStream);
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