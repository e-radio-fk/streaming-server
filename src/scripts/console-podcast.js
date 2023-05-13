$('#schedule-podcast-modal').on('show.bs.modal', () => {
    socket.on('server-sends-playlist-list', (list) => {

        /* fill selection */
        const selectElement = $('#schedule-podcast-playlists-selection');

        // Array of data to populate the <select> options; format [{ value, text }] 
        const optionsData = [
            { value: "", text: "-" },
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
})

/**
 * schedule_new_podcast()
 *
 * Gathers information (such as podcast title, descreption and scheduled time)
 * from the podcast scheduler modal and uploads it to the Firestore NoSQL database.
 */
function schedule_new_podcast() {
    var title = document.getElementById('podcast-title').value;
    var description = document.getElementById('podcast-description').value;
    var date = document.getElementById('podcast-date-picked-label').innerText;
    var start_time = document.getElementById('podcast-start-time').value;
    var end_time = document.getElementById('podcast-end-time').value;

    if (!title || !description || !date || !start_time || !end_time) {
        alert('Συμπλήρωσε όλα τα πεδία!');
        return;
    }

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "-" +
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

function start_podcast(podcast_id) {
    if (!podcast_id) {
        podcast_title = 'Random Podcast';
    }

    $('#start-podcast-modal').modal('show');
}

/**
 * start_podcast_after_soundcheck()
 * 
 * After all checks have been conducted pre-session we can start the session!
 */
function start_podcast_after_soundcheck() {
    $('#console-panels-object').css("display", "block");
    $('#console-start-podcast-button').css('display', 'none');
    $('#podcast-session-title').html(podcast_title);
}