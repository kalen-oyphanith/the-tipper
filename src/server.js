const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const myData = require('./myData.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

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

const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addReview') {
        const body = [];

        request.on('error', (err) => {
            console.dir(err);
            response.statusCode = 400;
            response.end();
        });

        request.on('data', (chunk) => {
            body.push(chunk);
        });

        request.on('end', () => {
            const bodyString = Buffer.concat(body).toString();
            const bodyParams = query.parse(bodyString);
            myData.addReview(request, response, bodyParams);
        });
    }
};

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);

    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
        //console.log(parsedUrl);
    } else if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'DELETE') {
        if (urlStruct[request.method][parsedUrl.pathname]) {
            urlStruct[request.method][parsedUrl.pathname](request, response);
        } else {
            urlStruct[request.method].notFound(request, response);
        }
    }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on localhost: ${port}`);
