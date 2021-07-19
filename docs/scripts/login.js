//
// Helpers
//
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/* sign_in
 *
 * Handles backed and frontend aspects of sign-in process
 */
function sign_in()
{
    var email = document.getElementById('login-form-uname').value;
    var passw = document.getElementById('login-form-passw').value;

    if (!email || !passw)
    {
        alert('Πληκτρολογήστε έγκυρα στοιχεία!');
        return;
    }

    if (!validateEmail(email))
    {
        alert('Πληκτρολογείστε έγκυρο EMAIL');
        return;
    }

    // TODO: sanitisation checks

    /* set sign-in persistance to be LOCAL: even after the browser closes the user is still logged in! */
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        /* Now sign-in with email & password */
        firebase.auth().signInWithEmailAndPassword(email, passw)
        .then((userCredential) => {
            /* ... the rest will be handled by the user-state-changed code */
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

    if (!uname || !email || !passw)
    {
        alert('Πληκτρολογήστε έγκυρα στοιχεία!');
        return;
    }

    if (!validateEmail(email))
    {
        alert('Πληκτρολογείστε έγκυρο EMAIL');
        return;
    }


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