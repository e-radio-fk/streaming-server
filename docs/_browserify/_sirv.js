import { request } from 'https';

//
// SIRV
//

const clientId = 'Vzxh2OxziBamlHKpwMh0MqbZhKT';
const clientSecret = 'z+so8b02rM+d35VFJ2bB9R8IXxIKRLbGZQ9WucVBMHlP/fnaKPN1He0/GwwtnnZvbF5527e5UDO2BrjrY52pgw==';

class helper {
    static serialize (obj, prefix) {
        var str = [],
          p;
        for (p in obj) {
          if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
              v = obj[p];
            str.push((v !== null && typeof v === "object") ?
              serialize(v, k) :
              encodeURIComponent(k) + "=" + encodeURIComponent(v));
          }
        }
        return str.join("&");
    }
}

export default class sirv {
    constructor() {
        this.token = '';
    }

    /*
     * function that makes REST calls to SIRV
     */
    sendRequest(url, options, callback) {      
        fetch(url, options)
        // TODO: find out why this doesn't work!
        // .then(response => response.json())
        .then(result => {
            console.log('Success:', result);

            callback(result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    //
    //  Member Functions
    //

    login(handler) {
        const options = {
            'method': 'POST',
            'hostname': 'api.sirv.com',
            'path': '/v2/token',
            'headers': {
                'content-type': 'application/json'
            }
        };

        const req = request(options, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
        
            res.on('end', () => {
                const body = Buffer.concat(chunks);
                const apiResponse = JSON.parse(body.toString());
            
                /* get token */
                this.token = apiResponse.token;
                
                /* success handler */
                handler(res);
            });
        });
        
        req.write(JSON.stringify({
            clientId,
            clientSecret
        }));

        req.end();
    }

    /*
     * filePath: the path of where the file should exist inside the SIRV server
     * file: the file (as in JS File API) to upload
     */
    uploadFile(filePath, file, callback) {
        var authorization = 'Bearer ' + this.token;

        var filename = helper.serialize({
            filename: filePath
        });

        let formData = new FormData();
        formData.append('file', file);

        var url = new URL('https://api.sirv.com/v2/files/upload');
        url.search = new URLSearchParams(filename);

        const options = {
            method: 'POST',
            headers: {
                authorization: authorization
            },
            body: file
        };

        this.sendRequest(url, options, callback);
    }
}