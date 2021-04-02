var firebaseConfig = {
    apiKey: "AIzaSyB37xSmEXteSUAyUdkrV4W_hVjyk0dsETY",
    authDomain: "e-radio-fk.firebaseapp.com",
    projectId: "e-radio-fk",
    storageBucket: "e-radio-fk.appspot.com",
    messagingSenderId: "152785870975",
    appId: "1:152785870975:web:3a9ea657cbd248e5e95f4a",
    measurementId: "G-1F2JYGKBEQ"
};

// Initialize Firebase
var fb = firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('First time: ', user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));

    //
    // If a user is already logged in, we should show the console or the user-view
    //
    if (window.location.pathname == '/' || window.location.href == "https://e-radio-fk.github.io/app/")
    	window.location.replace('console.html');
  } else {
    console.log('First time: no-user');
    sessionStorage.setItem('currentUser', JSON.stringify('no-user'));

    document.getElementsByTagName('header')[0].style.visibility = 'visible';
    document.getElementsByTagName('body')[0].style.visibility = 'visible';
  }
});