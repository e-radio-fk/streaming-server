var database = firebase.database();

/*
 * Now playing text
 */
database.ref().child('now-playing').get().then((snapshot) => {
    if (snapshot.exists())
    {
        if (!snapshot.val())
        {
            console.error('now-playing entry exists but is null!');
            return;    
        }

        Cookies.set('now-playing', snapshot.val());
    }
    else
    {
        console.error('now-playing entry doesnt exist in DB');
    }
}).catch((error) => {
    console.error('Error getting now-playing from DB: ' + error);
});