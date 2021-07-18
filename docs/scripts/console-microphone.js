//
// Microphone Capture Code
//

// let shouldStop = false;
// let stopped = false;

const socket = io.connect('/');

// let audioContext;
// if (typeof AudioContext === 'function') {
//   audioContext = new AudioContext();
// } else if (typeof webkitAudioContext === 'function') {
//   audioContext = new webkitAudioContext(); // eslint-disable-line new-cap
// } else {
//   console.log('Sorry! Web Audio not supported.');
// }

// microphone
// const _options = {  mimeType: "audio/ogg; codecs=opus",};
var recordedChunks = [];
var mediaRecorder = null;
let slice = 100;                        // how frequently we capture sound
const slices = 20;                      // 20 * => after 2 sec
let sendfreq = slice * slices;          // how frequently we send it

/* get microphone button handle */
var microphoneButton = document.getElementById('console-toggle-microphone');
microphoneButton.setAttribute('on', 'no');

/* initialise mic streaming capability */
navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
    mediaRecorder = new MediaRecorder(stream, {});
    if (!mediaRecorder)
    {
        show_error('Error: Failure creating a mediaRecorder; Reload page!', '...');
        return;
    }

    mediaRecorder.addEventListener('dataavailable', function(e) {
        if (e.data.size > 0)
        {
            recordedChunks.push(e.data);
        }
    });

    mediaRecorder.addEventListener('stop', function() {
        socket.emit('console-mic-stopping', '');

        // stop sending data
        clearInterval();
    });
    
    setInterval(() => {
        if (recordedChunks.length > 0)
        {
            console.log('sending!');
            socket.emit('console-mic-chunks', recordedChunks);
        }
    }, sendfreq);
})
.catch(function(err) {
    show_error('Error: Microphone access has been denied probably!', err);
});

function toggle_mic() {
    if (microphoneButton.getAttribute('on') == 'yes')
    {
        record_mic_stop();
        microphoneButton.setAttribute('on', 'no');
        microphoneButton.innerHTML = 'start mic';
    }
    else if (microphoneButton.getAttribute('on') == 'no') 
    {
        record_mic_start();
        microphoneButton.setAttribute('on', 'yes');
        microphoneButton.innerHTML = 'stop mic';
    }
}

function record_mic_start() 
{
    mediaRecorder.start(slice);
}
function record_mic_stop() 
{
    mediaRecorder.stop();
}