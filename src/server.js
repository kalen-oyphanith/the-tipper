const http = require('http'); // http module
const url = require('url'); // parsing url string module
const query = require('querystring'); //querystring module

// custom files
const htmlHandler = require('./htmlResponses.js');
const myData = require('./myData.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//object to route our requests to the proper handlers
const urlStruct = {
    GET: {
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getCSS,
        '/getReviews': myData.getReviews,
        '/getTip': myData.getTip,
        '/deleteReview': myData.deleteReview,
        notFound: myData.notFound,
    },
    HEAD: {
        '/getReviews': myData.getReviewsMeta,
        '/getTipMeta': myData.getTipMeta,
        notFound: myData.notFoundMeta,
    },
    DELETE: {
        '/deleteReview': myData.deleteReview,
        '/deleteReviewMeta': myData.deleteReviewMeta,
        notFound: myData.notFound,
    },
};

// Post request
const handlePost = (request, response, parsedUrl) => {
    // POST to /addReview
    if (parsedUrl.pathname === '/addReview') {
        const body = [];

        // if upload stream errors, throw bad request
        request.on('error', (err) => {
            console.dir(err);
            response.statusCode = 400;
            response.end();
        });

        //on 'data' is for each byte of data that comes in
        //from the upload. We will add it to our byte array.
        request.on('data', (chunk) => {
            body.push(chunk);
        });

        // end of upload stream
        request.on('end', () => {
            //combine byte array
            const bodyString = Buffer.concat(body).toString();
            // Parse string into an object by field name
            const bodyParams = query.parse(bodyString);
            // pass to addReview function
            myData.addReview(request, response, bodyParams);
        });
    }
};

const onRequest = (request, response) => {
    //parse url into individual parts
    //returns an object of url parts by name
    const parsedUrl = url.parse(request.url);

    //check if method was POST, otherwise GET or HEAD 
    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
        //console.log(parsedUrl);
    } else if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'DELETE') {
        //index into urlStruct by the method
        // returns another object we can index into by the pathname to get the handler
        if (urlStruct[request.method][parsedUrl.pathname]) {
            // call the actual function
            urlStruct[request.method][parsedUrl.pathname](request, response);
        } else {
            urlStruct[request.method].notFound(request, response);
        }
    }
};

// start up server
http.createServer(onRequest).listen(port);

console.log(`Listening on localhost: ${port}`);
