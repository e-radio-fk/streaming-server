/*
 * Importing and Uploading a playlist from:
 * - Youtube
 * - Spotify
 */

const ytdl = require('ytdl-core');

const yt_api_key = 'AIzaSyDfz9hJULAgoMlhf3ExmmJXX_U0L8IehsU';

export default class playlistHandler {
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

    /**
     * getList()
     * 
     * Queries the server and returns a list of all the Playlists saved
     */
    static async getList() {
        /* get a list of the admins from the DB */
        database.ref().child('/playlists').get().then(snapshot => {
            if (!snapshot)
            return null;

            if (snapshot.exists())
            {
                var json = snapshot.val();
                return Object.keys(json);
            }

        });

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