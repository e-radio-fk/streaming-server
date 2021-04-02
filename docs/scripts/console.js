/* get current user */
var user = JSON.parse(sessionStorage.getItem('currentUser'));
if ((!user) || (user.uid == undefined) || user == 'no-user')
{
    console.log('console: restricting view to unauthorised user!');

    if (window.location.href.indexOf('127.0.0.1') != -1)
        window.location.pathname = "/";
    else
        window.location.href = "https://e-radio-fk.github.io/app";

    // TODO: show error on main screen!
}
else
{
    document.getElementsByTagName('header')[0].style.visibility = 'visible';
    document.getElementsByTagName('body')[0].style.visibility = 'visible';

    /* construct photo path */
    var serverFilePath = '/' + user.uid + '/user_photo';
    var photoURL = 'https://eradiofk.sirv.com' + serverFilePath;
    
    console.log('got photo: ', photoURL);
    
    var userPhoto = document.getElementById('banner-user-img');
    
    if (photoURL)
        userPhoto.style.borderRadius = '35%';
    
    /* set user photo */
    userPhoto.src = photoURL;
}