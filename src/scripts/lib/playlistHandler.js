/*
 * Importing and Uploading a playlist from:
 * - Youtube
 * - Spotify
 */

const yt_api_key = 'AIzaSyDfz9hJULAgoMlhf3ExmmJXX_U0L8IehsU';

class playlistHandler {
    /**
     * constructor(forPlaylist: optional)
     * 
     * This creates a playlist handler for an already existing
     *  playlist with name `forPlaylist`.  If ommited, only the
     *  database is initialised.
     * @param {*} forPlaylist
     */
    constructor(forPlaylist) {
        this.database = firebase.database();
        if (!this.database)
            throw new Error('playlistHandler: database could not be initialised.');

        if (forPlaylist !== undefined)
        {
            if (!forPlaylist)
            throw new Error('playlistHandler: playlist is null');

            this.playlist = forPlaylist;
        }
    }

    setPlaylist(playlistName) {
        if (!playlistName)
            throw new Error('playlistHandler: cannot set playlist of reference as null');
        this.playlist = playlistName;
    }

    /**
     * getList()
     * 
     * Queries the server and returns a list of all the Playlists saved
     */
    static async getList() {
        /* get a list of the admins from the DB */
        var database = firebase.database();
        if (!database)
            return null;

        var snapshot = await database.ref().child('/playlists').once('value');
        if (!snapshot)
            return null;

        if (snapshot.exists())
        {
            var json = snapshot.val();
            if (!json)
                return null;
            return Object.keys(json);
        }
        else
            return null;
    }

    setPlaylist(playlistName) {
        if (!playlistName)
            throw new Error('playlistHandler: error setting playlist of reference!');
        this.playlist = playlistName;
    }

    addSong(filename) {
        if (!this.playlist)
            throw new Error('playlistHandler: adding song (' + filename + ') without valid playlist selected!');

        
    }
}