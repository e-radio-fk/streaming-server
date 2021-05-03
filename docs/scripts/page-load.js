/*
 * General script to run when loading a page!
 * ** Run in header **
 */

const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get('error');

if (error) {
    show_error('Error: ' + error, null);
}