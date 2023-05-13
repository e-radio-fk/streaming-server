//
// This is site's main
//

const express 				= require('express');
const app 					= express();
const server 				= require('http').Server(app);
const io 					= require('socket.io')(server, {
	cors: {
		origin: "https://e-radio-fk.onrender.com",
		methods: ["GET", "POST"]
	}
});
const ss 					= require('socket.io-stream');
const bodyParser 			= require('body-parser');
const firebase 				= require('firebase/app');
const auth 					= require('firebase/auth');

const fetch 				= require('node-fetch');

// Mixing Support
const RadioMixer 			= require('./RadioMixer');
// Music Management
const MusicManagement		= require('./PlaylistManagement').MusicManagement;
// Playlist Management
const PlaylistManagement	= require('./PlaylistManagement').PlaylistManagement;
const fs 					= require('fs');

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

/* mixedStream is sent to every client to listen to */
var mixedStream = null;
var microphone_stream = null;

var radio_mixer = null;

var file1 = null;

var _listening_for_clients = false;	// we can now start listening for clients!

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

			// res.redirect('/profile');
			// TODO: fixme
			res.redirect('/console');
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

const livechat_communication = io.of("/livechat-communication");

livechat_communication.on("connection", (socket) => {
	socket.on('client-message', (...args) => {
		livechat_communication.emit('server-sends-message', args[0], args[1], args[2]);
	});
});

io.of("/console-communication").on("connection", (socket) => {

	const MusicManager 		= new MusicManagement();
	const PlaylistManager 	= new PlaylistManagement();

	console.log('[2] Connection with console');

	socket.on('disconnect', () => {
		// socket has been disconnected
		console.log('[-] Disconnected ', socket.id);
	});

	/* first event our server must receive (communication with the console) */
	ss(socket).on('console-sends-microphone-stream', (_microphone_stream, callback) => {

		console.log('[2.1] Received microphone stream');

		// save it as global variable
		microphone_stream = _microphone_stream;

		microphone_stream.on('data', (data) => {
			// console.log('got data!');
		});

		callback({});	// acknowledgement

		socket.on('buffer', (buffer) => {
			microphone_stream.push(buffer);
		});

		// we can now start listening for clients!
		_listening_for_clients = true;
	});

	//
	//	Music & Playlist Management
	//
	socket.on('console-requests-yt-mp3-download', ({url, filename, shouldImport}) => {
		const onProgress = (downloaded, total) => {
			socket.emit('server-download-mp3-sends-progress', {downloaded, total});
		}
		const onEnd = (songUUID) => {
			socket.emit('server-download-mp3-sends-end');

			if (shouldImport)
			{
				MusicManager.import(songUUID);
			}
		};
		const onError = (reason) => {
			socket.emit('server-download-mp3-sends-failure', reason);
		}

		// start downloading ...
		MusicManager.downloadFromYT(url, filename, shouldImport, onProgress, onEnd, onError);
	});

	socket.on('console-requests-songs-list', () => {
		// send song list when ready
		MusicManager.songsList().then((list) => {
			socket.emit('server-sends-songs-list', list);
		})
	});

	socket.on('console-requests-create-playlist', ({playlistName, playlist}) => {
		console.log('got: ', playlistName);

		// create a playlist and send back result
		PlaylistManager.savePlaylist(playlistName, playlist).then((result) => {
			socket.emit('server-sends-create-playlist-result', result);
		});
	});
});

// now we can start communications with clients!
io.of("/clients-communication").on("connection", (socket) => {

	if (!_listening_for_clients)
	{
		socket.emit('server-sends-not-ready-yet');
		socket.disconnect();
		return;
	}

	// tell all clients they can start requesting for mixed_stream
	socket.emit('server-sends-ready');

	console.log('[3] Connection with client ', socket.id);

	socket.on('disconnect', () => {
		// socket has been disconnected
		console.log('[!] Disconnected ', socket.id);
	});

	socket.on('client-requests-mixed-stream', () => {

		console.log('[3.1] Client ', socket.id, ' requests mixed_stream');

		// TODO: this will be selected using the playlist in the future
		file1 = fs.createReadStream(__dirname + '/battle.mp3');

		// create our mixer class & get output stream
		radio_mixer = new RadioMixer(microphone_stream, file1);

		// get mixedStream
		mixedStream = radio_mixer.outputStream();

		console.log('[3] Client requests mixed_stream');

		// send the output stream (mixed stream) to all clients that are asking for it!
		ss(socket).emit('server-sends-mixed-stream', mixedStream);
	});
});

server.listen(3000);