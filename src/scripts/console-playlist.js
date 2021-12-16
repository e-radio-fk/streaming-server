var ph = new playlistHandler();
if (!ph)
    throw new Error('console: could not initialise playlist handler');

// 
// Populate the playlists list
// 
playlistHandler.getList().then(list => {
    if (!list)
        throw new Error('No playlists created yet or error getting them!');

    var sel = document.getElementById('playlists-selection');
    if (!sel)
        throw new Error('Error getting document element playlists-selection');

    list.forEach(element => {
        console.log('got element: ' + element)
    });
});