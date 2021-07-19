//
// Microphone Capture Code
//

const socket = io.connect('/');

var _stream;


// Κάθε φορά που λαμβάνουμε ένα δεδομένο (δηλ. ondataavail)
//  αυξάνουμε ένα μετρητή (chunksToSendCounter) όπου υποδηλώνει
//  το πόσα chunks θα στείλουμε στο επόμενο 2sec slice.
//
var chunksToSendCounter = 0;

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

    // mediaRecorder = new MediaRecorder(stream, {});
    // if (!mediaRecorder)
    // {
    //     show_error('Error: Failure creating a mediaRecorder; Reload page!', '...');
    //     return;
    // }

    // socket.on('microphone-new-client', () => {
    //     socket.emit('microphone-audio-header', null);
    // });

    // mediaRecorder.addEventListener('dataavailable', function(e) {
    //     if (e.data.size > 0)
    //     {
    //         recordedChunks.push(e.data);
    //         chunksToSendCounter++;
    //     }
    // });

    // mediaRecorder.addEventListener('stop', function() {
    //     socket.emit('console-mic-stopping', '');

    //     // stop sending data
    //     clearInterval();

    //     // TODO: probably check if any data is still in recordedChunks
    // });
    
    // setInterval(() => {
    //     if (recordedChunks.length > 0)
    //     {
    //         // critical section start

    //         let newChunksArray = recordedChunks.slice(0, chunksToSendCounter - 1);

    //         console.log('sending: ', newChunksArray);
    //         socket.emit('console-mic-chunks', newChunksArray);

    //         recordedChunks = recordedChunks.slice(chunksToSendCounter, -1);
    //         chunksToSendCounter = 0;

    //         // critical section stop
    //     }
    // }, sendfreq);
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
        microphoneButton.setAttribute('on', 'yes');
        microphoneButton.innerHTML = 'stop mic';

        function record_and_send(stream) {
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

function record_mic_start() 
{
    mediaRecorder.start(slice);
}
function record_mic_stop() 
{
    mediaRecorder.stop();
}