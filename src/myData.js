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
        message: 'Tipped!',
    };

    return respondJSON(request, response, 200, responseJSON);
};

const getTipMeta = (request, response) => respondJSON(request, response, 200);

const getReviews = (request, response) => {
    const responseJSON = {
        reviews,
    };

    return respondJSON(request, response, 200, responseJSON);
};

const getReviewsMeta = (request, response) => respondJSONMeta(request, response, 200);


const addReview = (request, response, body) => {
    const responseJSON = {
        message: 'The location, rating, description, and date are all required.',
    };

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
    reviews[body.name].description = body.description;
    reviews[body.name].rating = body.rating;
    reviews[body.name].date = body.date;

    if (responseCode === 201) {
        responseJSON.message = 'review was created';
        return respondJSON(request, response, responseCode, responseJSON);
    }
    // no body
    return respondJSONMeta(request, response, responseCode);
};

const deleteReview = (request, response) => {
    const responseJSON = {
        message: 'Reviews deleted!',
        reviews
    };
    for (let review in reviews) {
        delete reviews[review];
        console.log(reviews);
        console.log(review);
    }

    return respondJSON(request, response, 200, responseJSON);

};

const deletReviewMeta = () => respondJSONMeta(request, response, 202);

const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

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
