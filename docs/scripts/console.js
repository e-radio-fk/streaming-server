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
        end_time:       end_time
    }, (error) => {
        if (error) {
            show_error('Error: ' + error, error);
        } else {
            show_green('Success!');
        }

        /* do not forget to close the modal */
        $('#important-msg').modal('hide');
    });
}