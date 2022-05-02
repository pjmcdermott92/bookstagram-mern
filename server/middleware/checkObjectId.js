const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');

const checkObjectId = idToCheck => (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))
        return next(new ErrorResponse('Specified ID is invalid', 400));
    next();
}

module.exports = checkObjectId;
