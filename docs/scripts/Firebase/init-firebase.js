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

// Initialize Firebase
var fb = firebase.initializeApp(firebaseConfig);


/* isAdmin(user)
 *
 * takes a firebase `user` object and 
 * compares its uid to the uid of each of
 * the administrators stored inside the DB!
 * 
 * returns:
 *  true if admin
 *  false if not
 */
async function isAdmin(user)
{
    var result = false;
    var gotDBReply = false;

    /* get a list of the admins from the DB */
    var snapshot = await database.ref().child('/admins').get();

    if (snapshot.exists())
    {
        var json = snapshot.val();

        Object.keys(json).forEach(key => {
            if (user.uid == json[key])
            {
                result = true;
                // TODO: break;
            }
        });
    }

    return result;
}

//
// If a user is already logged in, we should show the console or the user-view
//
firebase.auth().onAuthStateChanged((user) => {
  if (user) 
  {
    // a user is logged-in; he is either admin or normal user

    console.log('current-user: ', user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));

    isAdmin(user).then(result => {
      /* change url (without logging to history => no back and forth)  */
      if (result && window.location.pathname == '/')
      {
          window.location.pathname = '/console.html';
      }
      else if (!result && window.location.pathname == '/')
      {
          window.location.pathname = '/index.html';
      }
    });
  } 
  else
  {
    // no user is logged-in

    console.log('current-user: no-user');
    sessionStorage.setItem('currentUser', JSON.stringify('no-user'));

    document.getElementsByTagName('header')[0].style.visibility = 'visible';
    document.getElementsByTagName('body')[0].style.visibility = 'visible';
  }
});