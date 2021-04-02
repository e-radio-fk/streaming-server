/* get current user */
var user = JSON.parse(sessionStorage.getItem('currentUser'));
if ((!user) || (user.uid == undefined) || user == 'no-user')
{
    console.log('console: restricting view to unauthorised user!');

    if (window.location.href.indexOf('127.0.0.1') != -1)
        window.location.pathname = "/" + '?error=UnauthorisedUser';
    else
        window.location.href = "https://e-radio-fk.github.io/app" + '?error=UnauthorisedUser';
}
else
{
    /* construct photo path */
    var serverFilePath = '/' + user.uid + '/user_photo';
    var photoURL = 'https://eradiofk.sirv.com' + serverFilePath;
    
    console.log('got photo: ', photoURL);
    
    var userPhoto = document.getElementById('banner-user-img');
    
    if (photoURL)
        userPhoto.style.borderRadius = '35%';
    
    /* set user photo */
    userPhoto.src = photoURL;

    // run an AJAX get request to the route you setup above...
    // respect the cross-domain policy by using the same domain
    // you used to access your index.html file!
    $.get('/enable-streaming', function() {
        console.log('Sending!');
    });
    
    /* initialisation has finished; show the UI */
    document.getElementsByTagName('header')[0].style.visibility = 'visible';
    document.getElementsByTagName('body')[0].style.visibility = 'visible';
}