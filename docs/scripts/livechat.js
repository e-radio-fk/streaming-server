var livechat_messages_list = document.getElementsByTagName('yt-live-chat-item-list-renderer')[0];

/*
 * adds a new message to the livechat
 */
function add_message_from_user(message, username, credentials) {

    var timestamp = '12:00';
    var credentials = 'owner';

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

/*
 * send message to the server!
 */