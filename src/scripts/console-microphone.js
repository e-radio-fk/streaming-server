//
// Microphone Capture Code
//

const socket = io.connect('/');

var _stream;

// microphone
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
    _stream = stream;
})
.catch(function(err) {
    show_error('Error: Microphone access has been denied probably!', err);
});

function toggle_mic() {
    if (microphoneButton.getAttribute('on') == 'yes')
    {
        clearInterval();
        microphoneButton.setAttribute('on', 'no');
        microphoneButton.innerHTML = 'start mic';
    }
    else if (microphoneButton.getAttribute('on') == 'no') 
    {
        microphoneButton.setAttribute('on', 'yes');
        microphoneButton.innerHTML = 'stop mic';

        function record_and_send() {
            const recorder = new MediaRecorder(_stream);
            const chunks = [];
            recorder.ondataavailable = e => chunks.push(e.data);
            recorder.onstop = e => socket.emit('console-mic-chunks', chunks);
            setTimeout(()=> recorder.stop(), sendfreq); // we'll have a 5s media file
            recorder.start();
        }
        // generate a new file every 5s
        setInterval(record_and_send, sendfreq); 
    }
}