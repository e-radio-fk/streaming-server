'use strict';

const ytdl      = require('ytdl-core');
const firebase  = require("firebase");
const firestore = require("firebase/firestore");

const fs        = require('fs');

class MusicManagement {
    constructor()
    {
        this.db = firebase.firestore();
    }

    downloadFromYT(url, filename, onProgressCallback, onEndCallback, onErrorCallback) {
        console.log('url: ',        url);
        console.log('filename: ',   filename);

        if (!url || !filename || !onProgressCallback || !onErrorCallback)
            return;
        // check if url is valid yt url
        if (!ytdl.validateURL(url)) 
        {
            onErrorCallback('invalid url');
            return;
        }

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
        audioStream.on('end', () => {
            // TODO: verify...

            onEndCallback();
        })

        // create and start pipe
        audioStream.pipe(file);
    }

    async songsList()
    {
        return new Promise(async (resolve, rejects) => {

            const list = [];

            const snapshot = await this.db.collection('songs').get();
            if (!snapshot)
                rejects('Failed to get songs snapshot from Firestore');

            snapshot.forEach((item) => {
                if (!item || !item.id || !item.data()) 
                {
                    console.log('error: null item or null data!')
                    rejects('null item or null data!');
                }

                const data = item.data();

                if (!data.name || !data.createdAt) 
                {
                    console.log('error: null name or null createdAt!')
                    rejects('null name or null createdAt!')
                }

                list.push({
                    id:         item.id,
                    name:       data.name,
                    createdAt:  data.createdAt
                });
            });

            resolve(list);
        });
    }
}

module.exports = MusicManagement;