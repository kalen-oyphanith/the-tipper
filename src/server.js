const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    GET: {
        '/': htmlHandler.getIndex,
        '/getTip': jsonHandler.getTip,
        notFound: jsonHandler.notFound,
    },
    HEAD: {
        '/getTip': jsonHandler.getTipMeta,
        notFound: jsonHandler.notFoundMeta,
    },
};

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addReview') {
        const body = [];

        request.on('error', (err) => { // if error
            console.dir(err);
            response.statusCode = 400;
            response.end();
        });

        // new piece of info comes in
        request.on('data', (chunk) => {
            body.push(chunk); // array
        });

        // on end of upload stream.
        request.on('end', () => {
            // all into one string
            const bodyString = Buffer.concat(body).toString();
            // name and age
            const bodyParams = query.parse(bodyString);
            // pass to our addUser function
            jsonHandler.addReview(request, response, bodyParams);
        });
    }
};
const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);

    console.dir(parsedUrl.pathname);
    console.dir(request.method);

    if (request.method === 'POST') { // POST
        handlePost(request, response, parsedUrl);
        // console.log(request.method);
        // console.log(parsedUrl);
    } else if (request.method === 'GET' || request.method === 'HEAD') { // GET or HEAD request
        if (urlStruct[request.method][parsedUrl.pathname]) {
            urlStruct[request.method][parsedUrl.pathname](request, response);
        } else {
            urlStruct[request.method].notFound(request, response);
        }
    }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on localhost: ${port}`);
