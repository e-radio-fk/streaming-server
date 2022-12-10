/* get microphone button handle */
var microphoneButton = document.getElementById('console-toggle-microphone');
microphoneButton.setAttribute('on', 'no');

//
// Microphone Capture Code
//

const socket = io.connect('/console-communication');

/* check if getUserMedia is available */
if (!navigator.mediaDevices.getUserMedia)
    show_error('Error: Unsupported feature getUserMedia()');

// our microphone audio stream
let audioStream;
// our microphone stream; this will be sent over to the server containing manipulated data from audioStream
var microphone_stream = ss.createStream();
// our recorder; it will support start(), stop() and ondatareceive()                    (not actual names!)
let recorder = null;

/* initialise mic capture capability */
navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(_audioStream => {

    audioStream = _audioStream;

    ss(socket).emit('console-sends-microphone-stream', microphone_stream, (answer) => {
        /* upon server acknowledge start working... */
        start_capture_and_send_pcm_data();
    });
})
.catch((err) => {
    show_error('Error: Microphone access has been denied probably!', err);
});

function start_capture_and_send_pcm_data()
{
    //--------------------------------------------------------------------------------------------------------------------------------------------
    //  Capture microphone PCM data & send to server!
    //
    //  (will be run on server acknowledge of the microphone_stream)
    //
    //  This is different  than using the MediaRecorder API approach.  We use this way
    //      because the MediaRecorder API doesn't support the PCM codec anymore and we
    //      are obliged to gather *ONLY* PCM data and send them through a stream.
    //
    //  Code from:
    //  https://medium.com/@ragymorkos/gettineg-monochannel-16-bit-signed-integer-pcm-audio-samples-from-the-microphone-in-the-browser-8d4abf81164d
    //------------------------------------------------------------------------------------------------------------------------------------------

    const context = window.AudioContext || window.webkitAudioContext;
    const audioContext = new context();

    // retrieve the current sample rate of microphone the browser is using
    const sampleRate = audioContext.sampleRate;

    // creates a gain node
    const volume = audioContext.createGain();
    
    // creates an audio node from the microphone incoming stream
    const audioInput = audioContext.createMediaStreamSource(audioStream);
    
    // connect the stream to the gain node
    audioInput.connect(volume);
    
    /*
        From the spec: This value controls how frequently the audioprocess event is
        dispatched and how many sample-frames need to be processed each call.
        Lower values for buffer size will result in a lower (better) latency.
        Higher values will be necessary to avoid audio breakup and glitches 
    */
    const bufferSize = 2048;
    recorder = audioContext.createJavaScriptNode.call(audioContext, bufferSize, 1, 1);

    const leftChannel = [];
    let recordingLength = 0;

    recorder.onaudioprocess = function(event) {
        const samples = event.inputBuffer.getChannelData(0);
        
        // we clone the samples
        leftChannel.push(new Float32Array(samples));
        
        recordingLength += bufferSize;

        function mergeBuffers(channelBuffer, recordingLength)
        {
            let result = new Float32Array(recordingLength);
            let offset = 0;
            
            for (let i = 0; i < channelBuffer.length; i++)
            {
                result.set(channelBuffer[i], offset);
                offset += channelBuffer[i].length;
            }
            
            return Array.prototype.slice.call(result);
        }
        
        const PCM32fSamples = mergeBuffers(leftChannel, recordingLength);

        const PCM16iSamples = [];

        for (let i = 0; i < PCM32fSamples.length; i++)
        {
            let val = Math.floor(32767 * PCM32fSamples[i]);
            val = Math.min(32767, val);
            val = Math.max(-32768, val);
            
            PCM16iSamples.push(val);
        }

        // push data to the stream; they will be automatically sent to the server
        microphone_stream.push(PCM16iSamples);
    };
        
    // we connect the recorder
    volume.connect(recorder);
}

function toggle_mic()
{
    if (microphoneButton.getAttribute('on') == 'yes')
    {
        recorder.disconnect();

        // TODO: probably send a message to the server??

        microphoneButton.setAttribute('on', 'no');
        microphoneButton.innerHTML = 'start mic';
    }
    else if (microphoneButton.getAttribute('on') == 'no') 
    {
        microphoneButton.setAttribute('on', 'yes');
        microphoneButton.innerHTML = 'stop mic';

        // TODO: is this the right way?
        
        // start recorder
        recorder.connect(audioContext.destination);
    }
}