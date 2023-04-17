//
// Our own baked-in e-radio Mixer
//
'use strict';

const ss    				= require('socket.io-stream');											// socket.io streams
const Mixer 				= require('audio-mixer').Mixer;											// node package to support mixing
const MPEGDecoderWebWorker 	= require('./scripts/lib/mpg123-decoder.min').MPEGDecoderWebWorker;		// decoding mp3 files

class RadioMixer
{
	constructor(_microphone_stream, _music_stream)
	{
		this.microphone_stream = _microphone_stream;
		this.music_stream = _music_stream;

		// the output stream
		this.mixedStream = ss.createStream();

		// mp3 decoder
		this.mp3Decoder = new MPEGDecoderWebWorker();

		// create a mixer object which does most of the work!
		this.mixer = new Mixer({
			channels: 2,
			bitDepth: 16,
			sampleRate: 44100,
			clearInterval: 100
		});

		//
		// create 2 inputs
		//
		this.input0 = this.mixer.input({
			    channels: 1,
			    bitDepth: 16,
			    sampleRate: 44100,
		});
		
		this.input1 = this.mixer.input({
			    channels: 2,
			    bitDepth: 16,
			    sampleRate: 44100,
		});

		this.mp3Decoder.ready.then(() => {
			console.log('-- mp3 decoder ready --');
		});

		// configure stream piping (like an audio graph)
		this.microphone_stream.pipe(this.input0);
		this.music_stream.pipe(this.input1);
		this.mixer.pipe(this.mixedStream);
	}

	outputStream()
	{
		return this.mixedStream;
	}
}

module.exports = RadioMixer;