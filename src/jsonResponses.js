const reviews = {};

const respondJSON = (request, response, status, object) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    response.writeHead(status, headers);
    response.write(JSON.stringify(object));
    response.end();
};

const respondJSONMeta = (request, response, status) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    // send response without json object, just headers
    response.writeHead(status, headers);
    response.end();
};

const getTip = (request, response) => {
    const responseJSON = {
        reviews,
        message: 'Bill amount, tip % and number of people are required.',
    };

    return respondJSON(request, response, 200, responseJSON);
};

const getTipMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const addReview = (request, response, body) => {
    const responseJSON = {
        message: 'Location name and description are required.',
    };
    console.dir(body.location);

    if (!body.location || !body.review) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201; // created

    if (reviews[body.location]) {
        responseCode = 204; // check to see if user exists
    } else {
        // otherwise create an object with that name
        reviews[body.location] = {};
        reviews[body.location].location = body.location;
    }

    reviews[body.location].review = body.review;

    if (responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }
    // no body
    return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    return respondJSON(request, response, 404, responseJSON);
};

// function for 404 not found without message
const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
    getTip,
    getTipMeta,
    addReview,
    notFound,
    notFoundMeta,
};
