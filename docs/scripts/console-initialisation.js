/* get current user */
var user = JSON.parse(sessionStorage.getItem('currentUser'));
if ((!user) || (user.uid == undefined) || user == 'no-user')
{
    console.log('console: restricting view to unauthorised user!');

    window.location.pathname = '/?error=UnauthorisedUser';
}
else
{
    /*
     * Page Initialisation
     */

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

    /* 
     * Modals Initialisation & Configuration 
     */

    // TODO:
    /* on modal exit, all elements must be reverted to normal */

    /*
     *  Initialise MCDatepicker 
     */
    /* create */
    const datePicker = MCDatepicker.create({
        el: '#podcast-datepicker',
        bodyType: 'modal'
    });

    /* hack: on open, quickly change z-index (>= 1061) so that calendar shows up above any bootstrap modal */
    datePicker.onOpen(() => {
        document.getElementsByClassName('mc-calendar--modal')[0].style.zIndex = "1062";
    });
    /* on OK button, save the date on a label element */
    datePicker.onSelect((date, formatedDate) => {
        document.getElementById('podcast-date-picked-label').innerHTML = formatedDate;
    })

    /*
     * Initialise Firebase Realtime Database
     */
    var database = firebase.database();
}