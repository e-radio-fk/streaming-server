import io from "socket.io-client";

var livechat_message_box = document.getElementById('live-chat-message-box');
var livechat_messages_list = document.getElementsByTagName('yt-live-chat-item-list-renderer')[0];

//
// Communications
//

const server_url = window.location.origin;

const socket = io.connect(server_url + '/clients-communication', { withCredentials: true });

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

function get_current_user() 
{
    var user_name = 'guest';

    var user = JSON.parse(sessionStorage.getItem('currentUser'));
    if ((!user) || (user.uid == undefined) || user == 'no-user')
        user_name = 'guest';
    else
        user_name = user.displayName;

    return user_name;
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
        var username = get_current_user();
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