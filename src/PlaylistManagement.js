'use strict';

const ytdl = require('ytdl-core');
const firebase = require("firebase");
const firestore = require("firebase/firestore");

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class MusicManagement {
    constructor() {
        this.db = firebase.firestore();

        //
        //  this.downloaded:
        //      registry of downloaded files
        //
        //  JSON with structure: 
        //      [uuid: string]: contents: fs.WriteSream, ...
        //
        this.downloaded = {};
    }

    downloadFromYT(url, filename, shouldImport, onProgressCallback, onEndCallback, onErrorCallback) {
        console.log('url: ', url);
        console.log('filename: ', filename);

        if (!url || !filename || !onProgressCallback || !onErrorCallback)
            return;
        // check if url is valid yt url
        if (!ytdl.validateURL(url)) {
            onErrorCallback('invalid url');
            return;
        }

        const uuid = uuidv4();
        const file = fs.createWriteStream(filename);

        const audioStream = ytdl(url, {
            quality: 'highestaudio',
            filter: 'audioonly',
            format: 'mp3',
        });

        // register a onProgressCallback
        audioStream.on('progress', (chunkLength, downloaded, total) => {
            onProgressCallback(downloaded, total);
        });
        file.on('finish', () => {
            if (!this.downloaded)
                return;

            // add to our registry of downloaded files...
            if (shouldImport) {
                this.downloaded[uuid] = file.path;
            }

            onEndCallback(uuid);
        })

        // create and start pipe
        audioStream.pipe(file);
    }

    import(uuid) {
        return new Promise((resolve, rejects) => {
            console.log('TODO: import: ', uuid, '; importing just the song name for now...');

            if (!this.downloaded || this.downloaded.length === 0 || !uuid || !this.downloaded[uuid])
                rejects('Error importing song: something is null...');

            const currentDate = new Date();

            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;

            // Add a new document in collection "cities"
            this.db.collection("songs").add({
                name: this.downloaded[uuid],
                createdAt: formattedDate
            })
                .then(() => {
                    resolve("success");
                })
                .catch((error) => {
                    rejects(error);
                });
        })
    }

    async songsList() {
        return new Promise(async (resolve, rejects) => {

            const list = [];

            const snapshot = await this.db.collection('songs').get();
            if (!snapshot)
                rejects('Failed to get songs snapshot from Firestore');

            snapshot.forEach((item) => {
                if (!item || !item.id || !item.data()) {
                    console.log('error: null item or null data!')
                    rejects('null item or null data!');
                }

                const data = item.data();

                if (!data.name || !data.createdAt) {
                    console.log('error: null name or null createdAt!')
                    rejects('null name or null createdAt!')
                }

                list.push({
                    id: item.id,
                    name: data.name,
                    createdAt: data.createdAt
                });
            });

            resolve(list);
        });
    }
}

/*
 * Importing and Uploading a playlist from:
 * - Youtube
 * - Spotify
 */

class PlaylistManagement {
    /**
     * constructor(forPlaylist: optional)
     * 
     * This creates a playlist handler for an already existing
     *  playlist with name `forPlaylist`.  If ommited, only the
     *  database is initialised.
     */
    constructor(forPlaylist) {
        this.database = firebase.database();
        if (!this.database)
            throw new Error('playlistHandler: database could not be initialised.');

        if (forPlaylist !== undefined) {
            if (!forPlaylist)
                throw new Error('playlistHandler: playlist is null');

            this.playlist = forPlaylist;
        }
    }

    /**
     * getList()
     * 
     * (Static Method)
     * Queries the server and returns a list of all the Playlists saved
     */
    async getList() {
        var database = firebase.database();
        if (!database)
            return null;

        var snapshot = await database.ref().child('/playlists').once('value');
        if (!snapshot)
            return null;

        if (snapshot.exists()) {
            var json = snapshot.val();
            if (!json)
                return null;
            return Object.keys(json);
        }
        else
            return null;
    }

    async savePlaylist(playlistName, playlist) {
        return new Promise(async (resolve, rejects) => {
            console.log('Saving playlist: ', playlistName, ' containing: ', playlist);

            if (!playlistName || !playlist || playlist.length === 0)
                return null;

            this.database.ref().child('/playlists').child(playlistName).set(playlist, (error) => {
                if (error)
                    rejects(error);
                else
                    resolve('success');
            });
        })
    };
}

module.exports = { MusicManagement, PlaylistManagement };