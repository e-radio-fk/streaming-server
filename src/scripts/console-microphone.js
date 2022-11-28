//
// Microphone Capture Code
//

const socket = io.connect('/');

// microphone
var _stream;
var mediaRecorder = null;

// record_and_send() intervals
var interval_ID;                    // for populating the chunks array      
var interval2_ID;                   // for sending the chunks array

/* get microphone button handle */
var microphoneButton = document.getElementById('console-toggle-microphone');
microphoneButton.setAttribute('on', 'no');

/* initialise mic streaming capability */
navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
    _stream = stream;
})
.catch((err) => {
    show_error('Error: Microphone access has been denied probably!', err);
});

function send_microphoneChunk(chunks)
{
    socket.emit('console-sends-mic-chunks', chunks);
}

function record_and_send() 
{
    var chunks = [];

    const recorder = new MediaRecorder(_stream);

    // on dataavailable send chunk to clients
    recorder.ondataavailable = e => chunks.push(e.data);

    interval_ID = setInterval(() => {
        recorder.stop();                // stop to write a chunk
        recorder.start();               // start to repeat, until 1sec has passed (see Interval below)
    }, 100);                            // 100ms frequency

    interval2_ID = setInterval(() => {
        recorder.stop();                // stop
        var chunks2 = chunks;           // copy for quick access
        chunks = [];                    // clear
        recorder.start();               // restart

        send_microphoneChunk(chunks2);  // send the copy without causing interference
    }, 1000);                           // 1sec frequency
}

function toggle_mic() 
{
    if (microphoneButton.getAttribute('on') == 'yes')
    {
        // clear intervals
        clearInterval(interval_ID);
        interval_ID = undefined;
        clearInterval(interval2_ID);
        interval2_ID = undefined;

        microphoneButton.setAttribute('on', 'no');
        microphoneButton.innerHTML = 'start mic';
    }
    else if (microphoneButton.getAttribute('on') == 'no') 
    {
        microphoneButton.setAttribute('on', 'yes');
        microphoneButton.innerHTML = 'stop mic';

        // start recording and sending data to clients
        record_and_send();
    }
}