const urlTextboxId = '#console-import-yt-mp3-with-url-textbox';
const filenameTextboxId = '#console-import-yt-mp3-with-filename-textbox';
const progressLabelId = '#console-import-yt-mp3-progress-label';

const createPlaylistTableId = "#console-create-playlist-table";

// get current url (the server is running on same domain!)
const server_url = window.location.origin;

// playlist to be created
var playlist = [];    // list of songId's

/*
 *  Establish connection with the server
 */
const socket = io.connect(server_url + '/console-communication', { withCredentials: true });

if (!socket) {
    show_error('Failed to load Socket.IO');
    throw "Failed to load Socket.IO";
}

const reloadTable = (list) => {
    if (!list || list.length === 0)
        return null;

    // clear old rows
    $(createPlaylistTableId + " tbody").empty();

    list.forEach((item) => {
        const itemId = item.id;
        const buttonId = 'button-' + itemId;

        const newRow = $("<tr>")
            .append($("<td>").text(item.name))
            .append($("<td>").text(item.createdAt))
            .append($("<td>")
                .append($("<button>")
                    .text('add')
                    .addClass('playlist-add-song-button')
                    .attr('id', buttonId)
                    .prop('clicked', false)
                    .click(() => {
                        const button = $('#' + buttonId);           // button id
                        const clicked = button.prop('clicked');     // clicked status
                        const text = button.text();                 // current text

                        button.prop('clicked', !clicked);
                        button.text(text === 'add' ? 'remove' : 'add');

                        if (text === 'add') {
                            playlist.push(item.id);
                        }
                        else if (text === 'remove') {
                            playlist = playlist.filter(songId => songId !== item.id);
                        }
                    }))
            );

        // Append the new row to the table body
        $(createPlaylistTableId + " tbody").append(newRow);
    });
};

const downloadYTMP3 = (shouldImport, onSuccessCallback, onFailureCallback) => {
    const url = $(urlTextboxId).val();
    const filename = $(filenameTextboxId).val();
    const progress = $(progressLabelId);

    console.log('url: ', url);
    console.log('filename: ', filename);
    console.log('progress: ', progress);

    if (!url || !filename || !progress)
        return null;
    if (url === "" || filename === "")
        return null;

    socket.on('server-download-mp3-sends-progress', ({ downloaded, total }) => {
        const progressText = Math.round(downloaded / total * 100) + ' %';
        progress.text(progressText)
    });
    socket.on('server-download-mp3-sends-end', () => {
        onSuccessCallback();
    });
    socket.on('server-download-mp3-sends-failure', (reason) => {
        onFailureCallback(reason);
    })

    /* request download */
    socket.emit('console-requests-yt-mp3-download', { url, filename, shouldImport });
}

const importYTMP3 = () => {
    const shouldImport = true;  // do download w/ import

    const onSuccess = () => {
        // TODO: this should show up on the modal...
        show_green('Downloaded successfully!');

        // -------- //
        //  IMPORT  //
        // -------- //

        socket.on('server-import-mp3-sends-end', () => {
            show_green('Successfully imported!');

            /* request new list of songs (after import) */
            socket.emit('console-requests-songs-list');
        });
        socket.on('server-import-mp3-sends-failure', (reason) => {
            show_error('Failed to import: ' + reason);
        })
    }
    const onFailure = (reason) => {
        show_error('Failed to download. Reason: ' + reason);
    }

    downloadYTMP3(shouldImport, onSuccess, onFailure);
};

const createPlaylist = () => {
    const playlistName = $('#console-create-playlist-name-textbox').val();

    if (!playlistName || !playlist || playlist.length === 0) {
        show_info('Please add songs to your playlist and a proper name');
        return null;
    }

    socket.on('server-sends-create-playlist-result', (result) => {
        if (result === 'success')
            show_green('Playlist created successfully!');
    })

    /* request playlist creation */
    socket.emit('console-requests-create-playlist', {playlistName, playlist});
}

const clearPlaylist = () => {
    const addSongButtonsList = $(".playlist-add-song-button");
    addSongButtonsList.each((index, element) => {
        $('#' + element.id).prop('clicked', false);
        $('#' + element.id).text('add');
    });
    $('#console-create-playlist-name-textbox').val('');
}

//                                       //
//  -------------- START --------------  //
//                                       //

socket.on('server-sends-songs-list', (list) => {
    reloadTable(list);
});

/* request list of songs */
socket.emit('console-requests-songs-list');