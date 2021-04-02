//
//  helpers
//

/* get a copy of the sign_in_up_space node */
const sign_in_up_space_copy = document.getElementById('sign-in-or-up-space-id').cloneNode(true);

function sign_in_up_box_set_visibility(id, visibility) {
    document.getElementById(id).style.visibility = visibility;
    
    var nodes = document.getElementById(id).children;
    for(var i = 0; i < nodes.length; i++) {
        nodes[i].style.visibility = visibility;
    }

    var inverse_visibility = (visibility == 'visible') ? 'hidden' : 'visible';

    document.getElementById('sign-in-button').style.visibility = inverse_visibility;
    document.getElementById('sign-in-text').style.visibility = inverse_visibility;
}

//
// Sign-in Box
//
function show_login_box() {
    document.getElementById('sign-in-button').remove();
    document.getElementById('sign-in-text').remove();

    sign_in_up_box_set_visibility('login-box', 'visible');
}
function hide_login_box() {
    document.getElementById('sign-in-or-up-space-id').innerHTML = sign_in_up_space_copy.innerHTML;

    sign_in_up_box_set_visibility('login-box', 'hidden');
}

//
// Sign-up Box
//
function show_signup_box() {
    document.getElementById('sign-in-button').remove();
    document.getElementById('sign-in-text').remove();
    document.getElementById('login-box').remove();

    sign_in_up_box_set_visibility('signup-box', 'visible');
}
function hide_signup_box() {
    document.getElementById('sign-in-or-up-space-id').innerHTML = sign_in_up_space_copy.innerHTML;

    sign_in_up_box_set_visibility('signup-box', 'hidden');
}

//
// Methods
//

function sign_in() {
    var email = document.getElementById('login-form-uname').value;
    var passw = document.getElementById('login-form-passw').value;

    // TODO: implement remember me
    // TODO: sanitisation checks

    /* set sign-in persistance to be LOCAL: even after the browser closes the user is still logged in! */
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        /* Now sign-in with email & password */
        firebase.auth().signInWithEmailAndPassword(email, passw)
        .then((user) => {
            /* change url (without logging to history => no back and forth)  */
            window.location.replace('console.html');
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
        if (window.location.href.indexOf('127.0.0.1') != -1)
            window.location.pathname = "/";
        else
            window.location.href = "https://e-radio-fk.github.io/app";
    }).catch((error) => {
        console.log('error: ', error);
    });
}