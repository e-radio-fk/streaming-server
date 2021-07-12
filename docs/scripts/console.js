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
    // var time;

    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();

    database.ref('/' + datetime).set({
        title: title,
        description: description,
        date: date,
        time: 'no-time-yet'
    });
}