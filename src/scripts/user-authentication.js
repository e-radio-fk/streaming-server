//
// Helpers
//
function validateEmail(email) {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

/* sign_in
 *
 * Handles backed and frontend aspects of sign-in process
 */
function sign_in(event) {
	// prevent using the /signin
	event.preventDefault();

	var username = document.getElementById("login-form-uname").value;
	var password = document.getElementById("login-form-passw").value;

	if (!username || !password) {
		alert("Πληκτρολογήστε έγκυρα στοιχεία!");
		return;
	}

	// TODO: sanitisation checks

	const option = {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		method: "POST",
		body: JSON.stringify({
			username: username,
			password: password,
		}),
	};

	// fetching data
	fetch("/signin", option)
		.then((res) => {
			// Ύστερα από επιτυχές sign-up μπορούμε να χρησιμοποιήσουμε το πρόγραμμα ως user
			window.location.href = res.url;
		})
		.catch((err) => {
			alert("Something happen wrong!");
		});
}

function sign_up() {
	alert("here!");

	var uname = document.getElementById("signup-form-uname").value;
	var email = document.getElementById("signup-form-email").value;
	var passw = document.getElementById("signup-form-passw").value;
	var isProducer = document.getElementById("signup-form-isProducer").value;

	console.log("got: ", uname, email, passw, isProducer);

	if (!uname || !email || !passw) {
		alert("Πληκτρολογήστε έγκυρα στοιχεία!");
		return;
	}

	if (!validateEmail(email)) {
		alert("Πληκτρολογείστε έγκυρο EMAIL");
		return;
	}

	// TODO: sanitisation checks

	/* create user */
	// firebase.auth().createUserWithEmailAndPassword(email, passw)
	// .then((userCredential) => {
	//     /* set username for this user */
	//     userCredential.user.updateProfile({
	//         displayName: uname
	//     }).then(function() {
	//         console.log('Successfully created a new account!');
	//     }).catch(function(error) {
	//         console.log('error: ', error);
	//     });
	// })
	// .catch((error) => {
	//     console.log('error: ', error);
	// });
}

function sign_out() {
	// TODO: is this safe?
	window.location.pathname = "/signout"; // force server to sign us out
}
