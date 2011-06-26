// Requirements:
// node.js
// npm install http
// npm install path 
// npm install fs

var http = require('http');
var path = require('path');
var fs = require('fs');

var s = http.createServer(function (request,response) {
    // Return 404 if someone sends anything but a GET request
    if (request.method !== "GET") {
        response.writeHead(404);
        response.end();
        return;
    }

    // Set default URL. Use this in the future for a "DocumentRoot"-like
    // functionality for source security?
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './streamer.html';

    // Stream whatever file instead of reading entire contents into memory.
    var stream = fs.createReadStream(filePath);

    // If there's an "error" emmission/event, respond with 404.
    stream.on("error", function () {
        response.writeHead(404);
        response.end();
        return;
    });

    // "fd" == "file description"
    stream.once("fd", function () {
        response.writeHead(200);
    });

    // Pipe the stream to the response 
    stream.pipe(response);

    return {
        // getFiles populates an array with the contents of a directory.
        // Need to update this to check endswith(".mp3"|".ogg"), exclude
        // subdirs, etc. This is just rudimentary til I figure out
        // something better.
        getFiles: function(dir) {
            var musicFiles = []
            fs.readdir(dir, function (err, files) {
                for (file in files) {
                    musicFiles.push(files[file]);
                };
            });
        }
    }

});

s.listen(8125);
console.log('Server running at http://127.0.0.1:8125/');
