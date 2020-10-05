const reviews = {};

// reponds with json object
// params: request, response, status code, object
const respondJSON = (request, response, status, object) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    response.writeHead(status, headers);
    response.write(JSON.stringify(object));
    response.end();
};

// respond without json body
// params: request, response, status code
const respondJSONMeta = (request, response, status) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    // send response without json object, just headers
    response.writeHead(status, headers);
    response.end();
};

// json message of success
const getTip = (request, response) => {
    const responseJSON = {
        message: 'Tipped!',
    };

    return respondJSON(request, response, 200, responseJSON);
};

// HEAD
const getTipMeta = (request, response) => respondJSON(request, response, 200);

//return reviews object as JSON
const getReviews = (request, response) => {
    const responseJSON = {
        reviews,
    };

    return respondJSON(request, response, 200, responseJSON);
};

const getReviewsMeta = (request, response) => respondJSONMeta(request, response, 200);

// Adds review from a POST body request
const addReview = (request, response, body) => {
    //default json message
    const responseJSON = {
        message: 'The location, rating, description, and date are all required.',
    };

    // if missing params, send back error message as a 400 badRequest
    if (!body.name || !body.description || !body.rating || !body.date) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201; // created

    if (reviews[body.name]) {
        responseCode = 204; // check to see if user exists
    } else {
        // otherwise create an object with that name
        reviews[body.name] = {};
        reviews[body.name].name = body.name;
    }

    //add/update fields for review
    reviews[body.name].description = body.description;
    reviews[body.name].rating = body.rating;
    reviews[body.name].date = body.date;

    //if review is created, set our created message
    if (responseCode === 201) {
        responseJSON.message = 'review was created';
        return respondJSON(request, response, responseCode, responseJSON);
    }
    // no body
    return respondJSONMeta(request, response, responseCode);
};

// Delete review from a DELETE request
const deleteReview = (request, response) => {
    // default message
    const responseJSON = {
        message: 'Reviews deleted!',
        reviews
    };

    // delete all reviews in review object
    for (let review in reviews) {
        delete reviews[review];
    }

    // return success status
    return respondJSON(request, response, 200, responseJSON);

};

// no body
const deletReviewMeta = () => respondJSONMeta(request, response, 202);

const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);


// make available to server.js
module.exports = {
    getTip,
    getTipMeta,
    deleteReview,
    getReviewsMeta,
    getReviews,
    addReview,
    notFound,
    notFoundMeta,
};
