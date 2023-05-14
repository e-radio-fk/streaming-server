var g_podcast_data = {
    title: null,
    description: null,
    date: null,
    start_time: null,
    end_time: null,
    playlist: null,
    id: null
}

$('#schedule-podcast-modal').on('show.bs.modal', () => {
    socket.on('server-sends-playlist-list', (list) => {

        /* fill selection */
        const selectElement = $('#schedule-podcast-playlists-selection');

        // Array of data to populate the <select> options; format [{ value, text }] 
        const optionsData = [
            { value: "", text: "- select -" },
            ...list.map((item) => { return { value: item, text: item } })
        ];

        // Clear existing options (optional)
        selectElement.empty();

        // Loop through the data and create <option> elements
        $.each(optionsData, function (index, option) {
            // Create <option> element
            const optionElement = $('<option>')
                .attr('value', option.value)
                .text(option.text);

            // Append <option> element to the <select>
            selectElement.append(optionElement);
        });

    })

    /* ask for list of playlists */
    socket.emit('console-requests-playlist-list');
});

/**
 * schedule_new_podcast()
 *
 * Gathers information (such as podcast title, descreption and scheduled time)
 * from the podcast scheduler modal and uploads it to the Firestore NoSQL database.
 */
function schedule_new_podcast() {
    const title = document.getElementById('podcast-title').value;
    const description = document.getElementById('podcast-description').value;
    const date = document.getElementById('podcast-date-picked-label').innerText;
    const start_time = document.getElementById('podcast-start-time').value;
    const end_time = document.getElementById('podcast-end-time').value;
    const playlist = document.getElementById('schedule-podcast-playlists-selection').value;

    if (!title || !description || !date || !start_time || !end_time || !playlist) {
        alert('Συμπλήρωσε όλα τα πεδία!');
        return;
    }

    const currentdate = new Date();
    const datetime = currentdate.getDate() + "-" +
        (currentdate.getMonth() + 1) + "-" +
        currentdate.getFullYear() + " @ " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds();

    database.ref().child('/scheduled-podcasts').child(datetime).set({
        title: title,
        description: description,
        date: date,
        start_time: start_time,
        end_time: end_time,
        playlist: playlist,
        id: guid()          /* create a unique random podcast-id */
    }, (error) => {
        if (error) {
            show_error('Error: ' + error, error);
        } else {
            show_green('Success!');
        }

        /* do not forget to close the modal */
        $('#schedule-podcast-modal').modal('hide');
    });
}

function start_podcast(podcast) {
    if (!podcast) {
        g_podcast_data["title"] = 'Random Podcast';
    }
    else {
        g_podcast_data = podcast;
    }

    $('#start-podcast-modal').modal('show');
}

/**
 * start_podcast_after_soundcheck()
 * 
 * After all checks have been conducted pre-session we can start the session!
 */
function start_podcast_after_soundcheck() {
    const currentPlaylistTable = $("#console-panels-playlist-table tbody");

    // clear old rows
    currentPlaylistTable.empty();

    // TODO: make this **actually** get the list

    const list = ['song1.mp3', 'song2.mp3'];

    list.forEach((item) => {
        const newRow = $("<tr>")
            .append($("<td>").text(item));

        currentPlaylistTable.append(newRow);
    });

    $('#console-panels-object').css("display", "block");
    $('#console-start-podcast-button').css('display', 'none');
    $('#podcast-session-title').html(g_podcast_data["title"]);
}