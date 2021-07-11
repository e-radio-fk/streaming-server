//
//  helpers
//

//
// Methods
//

function sign_in() {
    var email = document.getElementById('login-form-uname').value;
    var passw = document.getElementById('login-form-passw').value;

    // TODO: sanitisation checks

    /* set sign-in persistance to be LOCAL: even after the browser closes the user is still logged in! */
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        /* Now sign-in with email & password */
        firebase.auth().signInWithEmailAndPassword(email, passw)
        .then((user) => {
            /* change url (without logging to history => no back and forth)  */
            window.location.pathname = '/console.html';
        })
        .catch((error) => {
            console.log('error: ', error);
        });
    })
    .catch((error) => {
        console.log('error: ', error);
    });
}

function sign_up() {
    var uname = document.getElementById('signup-form-uname').value;
    var email = document.getElementById('signup-form-email').value;
    var passw = document.getElementById('signup-form-passw').value;

    // TODO: sanitisation checks

    /* create user */
    firebase.auth().createUserWithEmailAndPassword(email, passw)
    .then((userCredential) => {
        /* set username for this user */
        userCredential.user.updateProfile({
            displayName: uname
        }).then(function() {
            console.log('Successfully created a new account!');
        }).catch(function(error) {
            console.log('error: ', error);
        });
    })
    .catch((error) => {
        console.log('error: ', error);
    });
}

function sign_out() {
    firebase.auth().signOut().then(() => {
        /* signing-out; return to site home */
        window.location.pathname = "/";
    }).catch((error) => {
        console.log('error: ', error);
    });
}