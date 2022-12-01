//
// This is site's main
//

const express 			= require('express');
const app 				= express();
const server 			= require('http').Server(app);
const io 				= require('socket.io')(server);
const bodyParser 		= require('body-parser');
const firebase 			= require('firebase/app');
const auth 				= require('firebase/auth');

const fetch 			= require('node-fetch');

//
// NOTE: This library supports only WAV but it can support other decoders aswell (e.g. mp3decoder)
//
const AudioContext 		= require('@descript/web-audio-js').StreamAudioContext;		

const __project_root = __dirname + '/';

var firebaseConfig = {
	apiKey: "AIzaSyB37xSmEXteSUAyUdkrV4W_hVjyk0dsETY",
	authDomain: "e-radio-fk.firebaseapp.com",
	databaseURL: "https://e-radio-fk-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "e-radio-fk",
	storageBucket: "e-radio-fk.appspot.com",
	messagingSenderId: "152785870975",
	appId: "1:152785870975:web:3a9ea657cbd248e5e95f4a",
	measurementId: "G-1F2JYGKBEQ"
};

var loggedInUser = null;

/* project root */
app.use(express.static(__project_root));

/* 
 * Χρησιμοποιούμε αυτό το plugin για να 
 * μετατρέψουμε το body των POST requests
 * από JSON σε μεταβλήτές πιο εύκολα
 */
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

/*
 * Αρχικοποίηση του Firebase
 */
const fb = firebase.initializeApp(firebaseConfig);
if (!fb)
	console.log('server: Failure initialising Firebase!');

/*
 * Handle Login
 */
app.post('/signin', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
  
	console.log('username: ', username);
	console.log('password: ', password);

	// TODO: sanitisation checks

	/*
	 * Επιχειρούμε να κάνουμε login με τα στοιχεία που μας έδωσαν. Επίσης:
	 * set sign-in persistance to be LOCAL: even after the browser closes the user is still logged in! 
	 */
	// fb.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
		/* Now sign-in with email & password */
		fb.auth().signInWithEmailAndPassword(username, password).then((userCredential) => {
			/* ... the rest will be handled by the user-state-changed code */
			
			loggedInUser = userCredential.user;

			// TODO: fix isAdmin() part

			res.redirect('/profile');
			res.end();
		})
		.catch((error) => {
			// Ολοκλήρωση του request χωρίς redirect
			res.redirect('/');
			res.end();

			console.log('server: Error loging in: ' + error);
		});
	// })
	// .catch((error) => {
	// 	console.log('error: ', error);

	// 	// Ολοκλήρωση του request χωρίς redirect
	// res.redirect('/');
	// 	res.end();
	// });
});

app.get('/profile', (req, res) => {
	if (!loggedInUser)
	{
		res.sendFile('permissionDenied.html', { root: __project_root });
	}
	else
	{
		res.sendFile('profile.html', { root: __project_root });
	}
});
app.get('/console', (req, res) => {
	console.log('requesting console!');
	if (!loggedInUser)
	{
		res.sendFile('permissionDenied.html', { root: __project_root });
	}
	else
	{
		res.sendFile('console.html', { root: __project_root });
	}
});

/*
 * Handle Sign Up
 */
app.post('/signup', (req, res) => {
	res.sendFile('./');
});

app.get('/signout', (req, res) => {
	fb.auth().signOut().then(() => {
        /* signing-out; return to site home */
		loggedInUser = null;
		res.sendFile('/', { root: __project_root });
    }).catch((error) => {
        console.log('error: ', error);
    });
});

app.get('*', (req, res) => {
	res.sendFile('permissionDenied.html', { root: __project_root });
});

console.log('[1] Enabling stream.io...');

io.on("connection", (socket) => {
	socket.on('client-message', (...args) => {
		io.emit('message', args[0], args[1], args[2]);
	});

	//
	//	MICROPHONE PLAYBACK
	//

	function start()
	{
		console.log('here!');

		//
		//  taken from: https://stackoverflow.com/questions/37459231/webaudio-seamlessly-playing-sequence-of-audio-chunks
		//

		//
		// NOTE: This library doesn't work with ogg; use only MP3
		//

		// var sources = [ "https://upload.wikimedia.org/wikipedia/commons/b/be/Hidden_Tribe_-_Didgeridoo_1_Live.ogg", 
		//         "https://upload.wikimedia.org/wikipedia/commons/6/6e/Micronesia_National_Anthem.ogg"];

		// var sources = 	[ 	"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
		// 					"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" ];

		var sources 	= [ "http://127.0.0.1:3000/song1.wav", "http://127.0.0.1:3000/song2.wav" ];

		var channels    = [[0, 1], [1, 0]];

		var audio       = new AudioContext();

		var merger      = audio.createChannelMerger(2);
		var splitter    = audio.createChannelSplitter(2);

		// TODO: try and implement this using https://github.com/kuu/node-media-capture
		// var mixedAudio  = audio.createMediaStreamDestination();

		var duration    = 60000;
		var chunks      = [];

		function get(src) {
			return fetch(src).then((response) => {
				// console.log('response: ', response.arrayBuffer());
				return response.arrayBuffer()
			})
		}

		function stopMix(duration, ...media) {
			setTimeout((media) => {
				media.forEach((node) => {
					node.stop()
				})
			}, duration, media)
		}

		Promise.all(sources.map(get)).then((data) => 
		{
			return Promise.all(data.map((buffer, index) => 
			{
				// we create a source for each buffer
				// each source is converted to the splitter
				// the splitter is converted to the merger
				return audio.decodeAudioData(buffer).then((bufferSource) => 
				{
					var channel = channels[index];
					var source = audio.createBufferSource();
					source.buffer = bufferSource;
					source.connect(splitter);
					splitter.connect(merger, channel[0], channel[1]);
					return source
				})
			}))
			.then((audionodes) => 
			{
				// returns an array of nodes [AudioBufferSourceNode, AudioBufferSourceNode]
				// merger is connected to the mixedAudio (of which we will take the stream and wait for data on it => ondataavailable)
				// merger is also connected to audio.destination (speakers)
				merger.connect(mixedAudio);
				//merger.connect(audio.destination);
				
				// (Example)
				// merger.connect(audio.destination);
				// console.log(audionodes);
				// audio.pipe(process.stdout);

				var recorder = new MediaRecorder(mixedAudio.stream);
				recorder.start(0);
				audionodes.forEach((node) => {
					node.start(0)
				});

				stopMix(duration, ...audionodes, recorder);

				recorder.ondataavailable = (event) => {
					console.log('chunks: ', chunks);
					chunks.push(event.data);
				};

				interval_ID = setInterval(() => {
					recorder.stop();                // stop to write a chunk
					recorder.start();               // start to repeat, until 1sec has passed (see Interval below)
				}, 100);                            // 100ms frequency
			
				interval2_ID = setInterval(() => {
					recorder.stop();                // stop
					var chunks2 = chunks;           // copy for quick access
					chunks = [];                    // clear
					recorder.start();               // restart
			
					io.emit('server-sends-mic-chunks', chunks2);  // send the copy without causing interference
				}, 1000);                           // 1sec frequency
			})
		})
		.catch(function(e) {
			console.log(e)
		});
	}

	start();


	// socket.on('console-sends-mic-chunks', (data) => {
	// 	io.emit('server-sends-mic-chunks', data);
	// });

	//
	// console-sends:
	//

	//
	//	client-requests:
	//

	// // 
	// //	MUSIC PLAYBACK
	// // 
	// socket.on('MUSIC_TRACK_FILENAME', filename => {
	// 	io.emit('MUSIC_TRACK_FILENAME', filename);
	// });

	// /*
	//  * Requesting Position Handler
	//  *
	//  * Δημιουργούμε έναν handler για την περίπτωση που οποιοσδήποτε client ζητά
	//  *  να μάθει την position στο song για να ξεκινήσει να το παίζει.
	//  */
	// socket.on('MUSIC_TRACK_REQUESTING_POSITION', () => {
	// 	socket.emit('MUSIC_TRACK_POSITION', 0.2);			// TODO: fixme
	// });

	// socket.on('MUSIC_TRACK_START_WITH_FILENAME', (filename) => {
	// 	io.emit('MUSIC_TRACK_START_WITH_FILENAME', filename);
	// });

	// socket.on('MUSIC_TRACK_STOP', () => {
	// 	io.emit('MUSIC_TRACK_STOP');
	// });

	// socket.on('MUSIC_TRACK_VOLUME', newVolume => {
	// 	io.emit('MUSIC_TRACK_VOLUME', newVolume);
	// });
});

server.listen(3000);