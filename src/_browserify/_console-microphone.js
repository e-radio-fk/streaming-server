const MicrophoneStream = require('microphone-stream').default;
const { Transform } = require('stream');
const floatTo16BitPCM = require('./lib/floatTo16bitPCM').default;

const micStream = new MicrophoneStream();

const to16bitPCMTransform = new Transform({
    transform: (chunk, encoding, done) => {
        // convert to 16bitInt
        const raw = MicrophoneStream.toRaw(chunk);
        const result = floatTo16BitPCM(raw);
        done(null, result)
    }
});

/* get microphone button handle */
var microphoneButton = document.getElementById('console-toggle-microphone');
microphoneButton.style.disabled = 'true';
microphoneButton.setAttribute('on', 'no');

//
// Microphone Capture Code
//

const server_url = window.location.origin;

const socket = io.connect(server_url + '/console-communication', { withCredentials: true });

console.log(server_url + '/console-communication');

/* check if getUserMedia is available */
if (!navigator.mediaDevices.getUserMedia)
    show_error('Error: Unsupported feature getUserMedia()');

// our microphone stream; this will be sent over to the server containing manipulated data from audioStream
var microphone_stream = ss.createStream();

/* initialise mic capture capability */
navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(_audioStream => {
    // use this library to pipe to our socket.io-microphone-stream
    micStream.setStream(_audioStream);
    micStream.pipe(to16bitPCMTransform);
    to16bitPCMTransform.pipe(microphone_stream);

    // add handler for mic click
    microphoneButton.onclick = () => {
        if (microphoneButton.getAttribute('on') == 'yes') {
            microphoneButton.setAttribute('on', 'no');
            microphoneButton.innerHTML = 'start mic';
        }
        else if (microphoneButton.getAttribute('on') == 'no') {
            ss(socket).emit('console-sends-microphone-stream', microphone_stream, (answer) => {
                /* if server replies; change button status */
                microphoneButton.setAttribute('on', 'yes');
                microphoneButton.innerHTML = 'stop mic';
            });
        }
    };
}).catch((err) => {
    show_error('Error: Microphone access has been denied probably!', err);
});