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

//const AudioContext 		= require('web-audio-api').AudioContext;
// const AudioContext		= require('standardized-audio-context').AudioContext;

const AudioContext 		= require('@descript/web-audio-js').StreamAudioContext;

// const __project_root = __dirname + '/src';
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

	socket.on('console-sends-mic-chunks', (data) => {
		io.emit('server-sends-mic-chunks', data);
	});

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