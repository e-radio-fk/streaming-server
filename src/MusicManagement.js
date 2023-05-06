'use strict';

const fs = require('fs');
const ytdl = require('ytdl-core');

class MusicManagement {
    constructor() {

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
}

module.exports = MusicManagement;