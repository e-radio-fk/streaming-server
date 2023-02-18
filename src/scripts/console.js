//
//  Helpers
//

var import_playlist_platform;

// generates random id;
// from: https://learnersbucket.com/examples/javascript/unique-id-generator-in-javascript/
let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 * import_playlist_from()
 * 
 * Με αυτή τη συνάρτηση επιλέγουμε κάποιο playlist από το yt ή το spotify και
 *  όσο τα τραγούδια ανεβάζονται στο server δείχνουμε progress bar.
 */
function import_playlist_from(from)
{
    if ((from != 'yt') && (from != 'spotify'))
        return;

    import_playlist_platform = from;
    $('#import-playlist-modal').modal('show');
}

/**
 * test_mic()
 * 
 * Checks whether the platform can get audio from the microphone before starting a
 *  podcast.
 */
function test_mic()
{
    navigator.mediaDevices.getUserMedia({
        audio: true
    })
    .then(stream => {
        var element = document.getElementById('console-microphone-visualisation');
        playVisualisation(stream, element);
    })
    .catch(function (err) {
        console.log(err.message)
    });
}

/**
 * schedule_new_podcast()
 *
 * Gathers information (such as podcast title, descreption and scheduled time)
 * from the podcast scheduler modal and uploads it to the Firestore NoSQL database.
 */
function schedule_new_podcast()
{
    var title       = document.getElementById('podcast-title').value;
    var description = document.getElementById('podcast-description').value;
    var date        = document.getElementById('podcast-date-picked-label').innerText;
    var start_time  = document.getElementById('podcast-start-time').value;
    var end_time    = document.getElementById('podcast-end-time').value;

    if (!title || !description || !date || !start_time || !end_time)
    {
        alert('Συμπλήρωσε όλα τα πεδία!');
        return;
    }

    var currentdate = new Date();
    var datetime    =   currentdate.getDate()           + "-"   +
                        (currentdate.getMonth() + 1)    + "-"   +
                        currentdate.getFullYear()       + " @ " +
                        currentdate.getHours()          + ":"   +  
                        currentdate.getMinutes()        + ":"   +
                        currentdate.getSeconds();

    database.ref().child('/scheduled-podcasts').child(datetime).set({
        title:          title,
        description:    description,
        date:           date,
        start_time:     start_time,
        end_time:       end_time,
        id:             guid()          /* create a unique random podcast-id */
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

function start_podcast(podcast_id)
{
    var podcast_title = '';

    if (!podcast_id)
    {
        podcast_title = 'Random Podcast';
    }

    $('#start-podcast-modal').modal('show');
}

/**
 * start_podcast_after_soundcheck()
 * 
 * After all checks have been conducted pre-session we can start the session!
 */
function start_podcast_after_soundcheck()
{
    $('#console-panels-object').css("visibility", "visible");
}