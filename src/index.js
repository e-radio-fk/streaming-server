//
// This is site's main
//

const express 			= require('express');
const app 				= express();
const server 			= require('http').Server(app);
const io 				= require('socket.io')(server);
const ss 				= require('socket.io-stream');
const bodyParser 		= require('body-parser');
const firebase 			= require('firebase/app');
const auth 				= require('firebase/auth');

const fetch 			= require('node-fetch');

// Mixing Support
const RadioMixer 				= require('./RadioMixer');
const fs 						= require('fs');

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
let mixedStream = null;

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

io.of("/console-communication").on("connection", (socket) => {

	console.log('[2] Connection with console');

	/* first event our server must receive (communication with the console) */
	ss(socket).on('console-sends-microphone-stream', (_microphone_stream) => {

		io.emit('server-received-microphone-stream');

		// TODO: this will be selected using the playlist in the future
		const file1 = fs.createReadStream(__dirname + '/song2.wav');

		// create our mixer class & get output stream
		const radio_mixer = new RadioMixer(_microphone_stream, file1);

		// get mixedStream
		mixedStream = radio_mixer.outputStream();
	});
});

io.of("/clients-communication").on("connection", (socket) => {

	console.log('[3] Connection with client');

	socket.on('client-message', (...args) => {
		socket.emit('message', args[0], args[1], args[2]);
	});

	socket.on('client-requests-mixed-stream', () => {

		// TODO: could there be a case where a client connects to our server BEFORE the acquisition of the mixedStream in the line `mixedStream = radio_mixer.outputStream()`	???
		// 			In any case, lets add a guard for now.
		if (!mixedStream)
			return;

		console.log('[3] Client requests mixed_stream');

		// send the output stream (mixed stream) to all clients that are asking for it!
		ss(socket).emit('server-sends-mixed-stream', mixedStream);
	});
});

server.listen(3000);