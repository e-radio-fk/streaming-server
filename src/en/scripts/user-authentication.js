//
// Helpers
//
function validateEmail(email) {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function validatePassword(passw) {
	return passw.length >= 6;
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
			// Ύστερα από επιτυχές sign-in μπορούμε να χρησιμοποιήσουμε το πρόγραμμα ως user
			window.location.href = res.url;
		})
		.catch((err) => {
			alert("Something happen wrong!");
		});
}

function sign_up() {
	var email = document.getElementById("signup-form-email").value;
	var passw = document.getElementById("signup-form-passw").value;
	var isProducer = document.getElementById("signup-form-isProducer").checked;

	console.log("got: ", email, passw, isProducer);

	if (!email || !passw) {
		alert("Πληκτρολογήστε έγκυρα στοιχεία!");
		return;
	}

	if (!validateEmail(email)) {
		alert("Πληκτρολογείστε έγκυρο EMAIL");
		return;
	}

	if (!validatePassword(passw)) {
		alert("Ο κωδικός πρέπει ναναι τουλαχ. 6 χαρακτήρες.");
		return;
	}

	/* create user */
	const option = {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		method: "POST",
		body: JSON.stringify({
			email,
			password: passw,
			isProducer,
		}),
	};

	// fetching data
	fetch("/signup", option)
		.then((res) => {
			// Ύστερα από επιτυχές sign-up μπορούμε να χρησιμοποιήσουμε το πρόγραμμα ως user
			window.location.href = res.url;
		})
		.catch((err) => {
			alert("Something happen wrong!");
		});
}

function sign_out() {
	// TODO: is this safe?
	window.location.pathname = "/signout"; // force server to sign us out
}
