import io from "socket.io-client";

var livechat_message_box = document.getElementById('live-chat-message-box');
var livechat_messages_list = document.getElementsByTagName('yt-live-chat-item-list-renderer')[0];

//
// Communications
//

var port = '8081';
var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

// check if we are running localhost to remove the webservice port 3000
if (baseUrl.search('127.0.0.1') != -1)
    baseUrl = baseUrl.substr(0, baseUrl.length - 6);
else
    baseUrl = baseUrl.substr(0, baseUrl.length - 1);    // just remove /

baseUrl += ':' + port;

console.log('using', baseUrl);

const socket = io(':8081');

/* 
 * upon receiving a message 
 */
socket.on("message", (...args) => {
    
    /* 
        a message must always have the form: 
        arg[0] = message, 
        arg[1] = the user sending it 
        arg[2] = his/her credentials
    */

    if (args.length != 3)
        return;

    add_message_from_user(args[0], args[1], args[2]);
});

/*
 * 
 */
function post_message_to_server(message, username, credentials)
{
    socket.emit('client-message', message, username, credentials);
}

//
// Livechat Message Box
//

// TODO:    make sure the page has loaded only when 
//          the connection and chatbox's event controller have been established

/* 
 * We must add an "Enter" pressed event handler
 */
livechat_message_box.addEventListener('keyup', event => {
    event.preventDefault()
    
    if (event.key == 'Enter')
    {
        var message = livechat_message_box.value;
        var username = 'npyl';
        var credentials = 'owner';

        post_message_to_server(message, username, credentials);

        /* clear message box contents */
        livechat_message_box.value = '';
    }
});

//
// Livechat Interface
//

/*
 * adds a new message to the livechat
 */
function add_message_from_user(message, username, credentials) {

    var timestamp = '12:00';

    /* create message */
    var new_message = document.createElement('yt-live-chat-text-message-renderer');
    new_message.setAttribute('author-name', 'owner');
    new_message.innerHTML =     '<div id="author-photo"></div>' +
                                '<div id="content">' +
                                '   <span id="timestamp">' + timestamp +'</span>' +
                                '   <span id="author-badges">' +
                                '       <yt-live-chat-author-badge-renderer type="owner">' +
                                '       </yt-live-chat-author-badge-renderer>' +
                                '   </span>' +
                                '   <span id="author-name" type="owner">' + username + '</span>' +
                                '   <span id="message">'+ message + '</span>' +
                                '</div>';

    livechat_messages_list.appendChild(new_message);
}