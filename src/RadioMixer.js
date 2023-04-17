//
// Our own baked-in e-radio Mixer
//
'use strict';

const ss    	= require('socket.io-stream');
const Mixer 	= require('audio-mixer').Mixer;		// node package to support mixing
const ffmpeg 	= require('fluent-ffmpeg');

const { Transform } = require('stream');

const pcmDecoder = new Transform({
	transform(chunk, encoding, callback) {
	  // Pass the PCM chunk along to the next stream
	  callback(null, chunk);
	},
  });

class RadioMixer
{
	constructor(_microphone_stream, _music_stream)
	{
		this.microphone_stream = _microphone_stream;
		this.music_stream = _music_stream;

		// the output stream
		this.mixedStream = ss.createStream();

		// create a mixer object which does most of the work!
		this.mixer = new Mixer({
			channels: 2,
			bitDepth: 16,
			sampleRate: 44100,
			clearInterval: 100
		});

		// Use the PCM decoder stream like any other Node.js stream
		pcmDecoder.on('data', (pcmChunk) => {
			console.log(`Got PCM chunk with length ${pcmChunk.length}`);
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

		var command = ffmpeg(this.music_stream)
			.format('s16le')
			.audioFrequency(44100)
			.audioChannels(2)
			.on('error', (err) => {
				console.error(`Error decoding MP3 file: ${err}`);
			})
			.pipe(pcmDecoder);

		// configure stream piping (like an audio graph)
		this.microphone_stream.pipe(this.input0);
		pcmDecoder.pipe(this.input1);
		this.mixer.pipe(this.mixedStream);
	}

	outputStream()
	{
		return this.mixedStream;
	}
}

module.exports = RadioMixer;