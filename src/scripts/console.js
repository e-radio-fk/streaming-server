//
//  Helpers
//

var import_playlist_platform;
var podcast_title;

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