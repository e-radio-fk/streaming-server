//
// SETTINGS
//

import sirv from './_sirv.js';
import general from './_general.js';

//
// Variables
//

var user;
var serverFilePath;
var photoURL;

var user_photo_container = document.getElementById('user-photo-container');
var user_photo_caption = document.getElementsByClassName('user-photo-caption');
var user_photo = document.getElementById('user-photo');

var spinner = document.getElementById('spinner');

var s = new sirv();
var g = new general();

//
// Methods
//

function start_spinner() {
    spinner.style.visibility = 'visible';
}
function stop_spinner() {
    spinner.style.visibility = 'hidden';
}

function update_photo() {
    var d = new Date;
    var http = user_photo.src;
    if (http.indexOf("&d=") != -1) { 
        http = http.split("&d=")[0]; 
    }

    user_photo.src = http + '&d=' + d.getTime();

    // reload window without cache
    window.location.reload(true);
}

function upload_photo(file) {
    start_spinner();

    /* SIRV login */
    s.login((res) => {
        if (!res.ok)
        {
            stop_spinner();
            g.show_error('Failed to upload photo!', res);
        }
        else
        {
            s.uploadFile(serverFilePath, file, (res) => {
                update_photo();
    
                stop_spinner();
            });
        }
    });
}

function set_photo() {
    /*
     * Open File Manager
     */
    var input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.onchange = e => { 
        /* get the file; we allow only one */
        var file = e.target.files[0];

        /* upload photo */
        upload_photo(file);
    }

    /* open file manager */
    input.click();
}

//==========//
//   CODE   //
//==========//

/* get current user */
user = JSON.parse(sessionStorage.getItem('currentUser'));
console.log('settings: user is ', user);

/* sanity checks */
if ((!user) || (user.uid == undefined) || user == 'no-user') 
{
    if (window.location.href.indexOf('127.0.0.1') != -1)
        window.location.pathname = "/" + '?error=UnauthorisedUser';
    else
        window.location.href = "https://e-radio-fk.github.io/app" + '?error=UnauthorisedUser';
}
else
{
    document.getElementsByTagName('body')[0].style.visibility = 'visible';

    /* construct photo path */
    serverFilePath = '/' + user.uid + '/user_photo';
    photoURL = 'https://eradiofk.sirv.com' + serverFilePath;

    user_photo.src = photoURL + '?t=' + new Date().getTime();

    /*
     * At this point we have defined our functions, but normal html cannot
     *  see our Node.JS functions (e.g. set_photo()).  Therefore, we assign
     *  onclick handlers through here!
     */
    user_photo_container.onclick = set_photo;
}