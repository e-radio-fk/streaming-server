const urlTextboxId      = '#console-import-yt-mp3-with-url-textbox';
const filenameTextboxId = '#console-import-yt-mp3-with-filename-textbox';
const progressLabelId   = '#console-import-yt-mp3-progress-label';

// get current url (the server is running on same domain!)
const server_url = window.location.origin;

/*
 *  Establish connection with the server
 */
const socket = io.connect(server_url + '/console-communication', { withCredentials: true });

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

    socket.emit('console-requests-yt-mp3-download', {url, filename});
}