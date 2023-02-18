/* get microphone button handle */
var microphoneButton = document.getElementById('console-toggle-microphone');
microphoneButton.style.disabled = 'true';
microphoneButton.setAttribute('on', 'no');

//
// Microphone Capture Code
//

const socket = io.connect('/console-communication');

/* check if getUserMedia is available */
if (!navigator.mediaDevices.getUserMedia)
    show_error('Error: Unsupported feature getUserMedia()');

// our microphone audio stream
var audioStream;
// our microphone stream; this will be sent over to the server containing manipulated data from audioStream
var microphone_stream = ss.createStream();
// our recorder; it will support start(), stop() and ondatareceive()                    (not actual names!)
var recorder = null;

const context = window.AudioContext || window.webkitAudioContext;
const mic_audio_context = new context();

if (!mic_audio_context)
    show_error('Error: Failed to create Audio Context');

/* initialise mic capture capability */
navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(_audioStream => {

    audioStream = _audioStream;

    recorder = RecordRTC(audioStream, {
        type: 'audio',
        recorderType: StereoAudioRecorder,
        numberOfAudioChannels: 1
    });

    ss(socket).emit('console-sends-microphone-stream', microphone_stream, (answer) => {
        microphoneButton.style.disabled = 'false';
    });
})
.catch((err) => {
    show_error('Error: Microphone access has been denied probably!', err);
});

function toggle_mic()
{
    if (microphoneButton.getAttribute('on') == 'yes')
    {
        recorder.stopRecording(stopRecordingCallback);

        // TODO: probably send a message to the server??

        microphoneButton.setAttribute('on', 'no');
        microphoneButton.innerHTML = 'start mic';
    }
    else if (microphoneButton.getAttribute('on') == 'no') 
    {
        microphoneButton.setAttribute('on', 'yes');
        microphoneButton.innerHTML = 'stop mic';
        
        // start recorder
        recorder.startRecording();

        // release microphone on stopRecording
        recorder.microphone = audioStream;
    }
}

function mergeLeftRightBuffers(config, callback) {
    function mergeAudioBuffers(config, cb) {
        var numberOfAudioChannels = config.numberOfAudioChannels;

        // todo: "slice(0)" --- is it causes loop? Should be removed?
        var leftBuffers = config.leftBuffers.slice(0);
        var rightBuffers = config.rightBuffers.slice(0);
        var sampleRate = config.sampleRate;
        var internalInterleavedLength = config.internalInterleavedLength;
        var desiredSampRate = config.desiredSampRate;

        if (numberOfAudioChannels === 2) {
            leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
            rightBuffers = mergeBuffers(rightBuffers, internalInterleavedLength);
            if (desiredSampRate) {
                leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
                rightBuffers = interpolateArray(rightBuffers, desiredSampRate, sampleRate);
            }
        }

        if (numberOfAudioChannels === 1) {
            leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
            if (desiredSampRate) {
                leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
            }
        }

        // set sample rate as desired sample rate
        if (desiredSampRate) {
            sampleRate = desiredSampRate;
        }

        // for changing the sampling rate, reference:
        // http://stackoverflow.com/a/28977136/552182
        function interpolateArray(data, newSampleRate, oldSampleRate) {
            var fitCount = Math.round(data.length * (newSampleRate / oldSampleRate));
            //var newData = new Array();
            var newData = [];
            //var springFactor = new Number((data.length - 1) / (fitCount - 1));
            var springFactor = Number((data.length - 1) / (fitCount - 1));
            newData[0] = data[0]; // for new allocation
            for (var i = 1; i < fitCount - 1; i++) {
                var tmp = i * springFactor;
                //var before = new Number(Math.floor(tmp)).toFixed();
                //var after = new Number(Math.ceil(tmp)).toFixed();
                var before = Number(Math.floor(tmp)).toFixed();
                var after = Number(Math.ceil(tmp)).toFixed();
                var atPoint = tmp - before;
                newData[i] = linearInterpolate(data[before], data[after], atPoint);
            }
            newData[fitCount - 1] = data[data.length - 1]; // for new allocation
            return newData;
        }

        function linearInterpolate(before, after, atPoint) {
            return before + (after - before) * atPoint;
        }

        function mergeBuffers(channelBuffer, rLength) {
            var result = new Float64Array(rLength);
            var offset = 0;
            var lng = channelBuffer.length;

            for (var i = 0; i < lng; i++) {
                var buffer = channelBuffer[i];
                result.set(buffer, offset);
                offset += buffer.length;
            }

            return result;
        }

        function interleave(leftChannel, rightChannel) {
            var length = leftChannel.length + rightChannel.length;

            var result = new Float64Array(length);

            var inputIndex = 0;

            for (var index = 0; index < length;) {
                result[index++] = leftChannel[inputIndex];
                result[index++] = rightChannel[inputIndex];
                inputIndex++;
            }
            return result;
        }

        function writeUTFBytes(view, offset, string) {
            var lng = string.length;
            for (var i = 0; i < lng; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }

        // interleave both channels together
        var interleaved;

        if (numberOfAudioChannels === 2) {
            interleaved = interleave(leftBuffers, rightBuffers);
        }

        if (numberOfAudioChannels === 1) {
            interleaved = leftBuffers;
        }

        var interleavedLength = interleaved.length;

        // create wav file
        var resultingBufferLength = 44 + interleavedLength * 2;

        var buffer = new ArrayBuffer(resultingBufferLength);

        var view = new DataView(buffer);

        // RIFF chunk descriptor/identifier 
        writeUTFBytes(view, 0, 'RIFF');

        // RIFF chunk length
        view.setUint32(4, 44 + interleavedLength * 2, true);

        // RIFF type 
        writeUTFBytes(view, 8, 'WAVE');

        // format chunk identifier 
        // FMT sub-chunk
        writeUTFBytes(view, 12, 'fmt ');

        // format chunk length 
        view.setUint32(16, 16, true);

        // sample format (raw)
        view.setUint16(20, 1, true);

        // stereo (2 channels)
        view.setUint16(22, numberOfAudioChannels, true);

        // sample rate 
        view.setUint32(24, sampleRate, true);

        // byte rate (sample rate * block align)
        view.setUint32(28, sampleRate * 2, true);

        // block align (channel count * bytes per sample) 
        view.setUint16(32, numberOfAudioChannels * 2, true);

        // bits per sample 
        view.setUint16(34, 16, true);

        // data sub-chunk
        // data chunk identifier 
        writeUTFBytes(view, 36, 'data');

        // data chunk length 
        view.setUint32(40, interleavedLength * 2, true);

        // write the PCM samples
        var lng = interleavedLength;
        var index = 44;
        var volume = 1;
        for (var i = 0; i < lng; i++) {
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
        }

        if (cb) {
            return cb({
                buffer: buffer,
                view: view
            });
        }

        postMessage({
            buffer: buffer,
            view: view
        });
    }

    if (!isChrome) {
        // its Microsoft Edge
        mergeAudioBuffers(config, function(data) {
            callback(data.buffer, data.view);
        });
        return;
    }

    var webWorker = processInWebWorker(mergeAudioBuffers);

    webWorker.onmessage = function(event) {
        callback(event.data.buffer, event.data.view);

        // release memory
        URL.revokeObjectURL(webWorker.workerURL);
    };

    webWorker.postMessage(config);
}

function processInWebWorker(_function) {
    var workerURL = URL.createObjectURL(new Blob([_function.toString(),
        ';this.onmessage =  function (eee) {' + _function.name + '(eee.data);}'
    ], {
        type: 'application/javascript'
    }));

    var worker = new Worker(workerURL);
    worker.workerURL = workerURL;
    return worker;
}

function stopRecordingCallback() 
{
    // ------------------------------------------------------------
    // get access to StereoAudioRecorder object (name as "internal-recorder")
    // ------------------------------------------------------------
    var internalRecorder = recorder.getInternalRecorder();

    // ------------------------------------------------------------
    // get left and right audio channels
    // ------------------------------------------------------------
    var leftchannel = internalRecorder.leftchannel;
    var rightchannel = internalRecorder.rightchannel;

    // ------------------------------------------------------------
    // create your own WAV
    // ------------------------------------------------------------
    mergeLeftRightBuffers({
        desiredSampRate: internalRecorder.desiredSampRate,
        sampleRate: internalRecorder.sampleRate,
        numberOfAudioChannels: internalRecorder.numberOfAudioChannels,
        internalInterleavedLength: internalRecorder.recordingLength,
        leftBuffers: leftchannel,
        rightBuffers: internalRecorder.numberOfAudioChannels === 1 ? [] : rightchannel
    }, function(buffer, view) {
        // ------------------------------------------------------------
        // here is your own WAV (generated by your own codes)
        // ------------------------------------------------------------

        console.log('!!! console: pushing data !!!');

        // // push to our stream
        // microphone_stream.push(buffer);
        socket.emit('buffer', buffer);
    });

    recorder.microphone.stop();
}