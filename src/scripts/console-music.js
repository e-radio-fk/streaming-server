const urlTextboxId          = '#console-import-yt-mp3-with-url-textbox';
const filenameTextboxId     = '#console-import-yt-mp3-with-filename-textbox';
const progressLabelId       = '#console-import-yt-mp3-progress-label';

const createPlaylistTableId = "#console-create-playlist-table";

// get current url (the server is running on same domain!)
const server_url = window.location.origin;

/*
 *  Establish connection with the server
 */
const socket = io.connect(server_url + '/console-communication', { withCredentials: true });

if (!socket)
{
    show_error('Failed to load Socket.IO');
    throw "Failed to load Socket.IO";
}

socket.on('server-sends-songs-list', (list) => {
    if (!list || list.length === 0)
        return null;
    
    list.forEach((item) => {
        const newRow = $("<tr>")
            .append($("<td>").text(item.name))
            .append($("<td>").text(item.createdAt));
  
        // Append the new row to the table body
        $(createPlaylistTableId + " tbody").append(newRow);
    });
});

/* request list of songs */
socket.emit('console-requests-songs-list');

const downloadYTMP3 = () => {
    const url       = $(urlTextboxId).val();
    const filename  = $(filenameTextboxId).val();
    const progress  = $(progressLabelId);

    console.log('url: ',        url);
    console.log('filename: ',   filename);
    console.log('progress: ',   progress);

    if (!url || !filename || !progress)
        return null;
    if (url === "" || filename === "")
        return null;

    socket.on('server-download-mp3-sends-progress', ({downloaded, total}) => {
        const progressText = Math.round(downloaded / total * 100) + ' %';
        progress.text(progressText)
    });
    socket.on('server-download-mp3-sends-end', () => {
        alert('end!');
    });
    socket.on('server-download-mp3-sends-failure', (reason) => {
        alert('Failed to download. Reason: ' + reason)
    })

    /* request download */
    socket.emit('console-requests-yt-mp3-download', {url, filename});
}