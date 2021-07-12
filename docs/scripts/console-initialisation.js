/* get current user */
var user = JSON.parse(sessionStorage.getItem('currentUser'));
if ((!user) || (user.uid == undefined) || user == 'no-user')
{
    console.log('console: restricting view to unauthorised user!');

    window.location.pathname = '/?error=UnauthorisedUser';
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
    
    /* initialisation has finished; show the UI */
    document.getElementsByTagName('header')[0].style.visibility = 'visible';
    document.getElementsByTagName('body')[0].style.visibility = 'visible';

    /* Initialise MCDatepicker */
    /* javascript */
    const datePicker = MCDatepicker.create({
        el: '#datepicker',
        bodyType: 'modal'
    });

    /* hack: on open, quickly change z-index (>= 1061) so that calendar shows up above any bootstrap modal */
    datePicker.onOpen(() => {
        document.getElementsByClassName('mc-calendar--modal')[0].style.zIndex = "1062";
    });
    datePicker.onSelect((date, formatedDate) => {
        document.getElementById('podcast-date-picked-label').innerHTML = formatedDate;
    })
}