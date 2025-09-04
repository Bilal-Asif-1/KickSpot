

const { successResponse, errorResponse, paginationResponse } = require('../utils/helpers/responseFormatter');


const responseHandler = (req, res, next) => {
  // Add success response method
  res.success = (data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json(successResponse(data, message));
  };

  // Add error response method
  res.error = (message = 'An error occurred', statusCode = 500, errors = null) => {
    return res.status(statusCode).json(errorResponse(message, errors));
  };

  // Add pagination response method
  res.paginate = (data, page, limit, total) => {
    return res.status(200).json(paginationResponse(data, page, limit, total));
  };

  // Add not found response method
  res.notFound = (message = 'Resource not found') => {
    return res.status(404).json(errorResponse(message));
  };

  // Add bad request response method
  res.badRequest = (message = 'Bad request', errors = null) => {
    return res.status(400).json(errorResponse(message, errors));
  };

  // Add unauthorized response method
  res.unauthorized = (message = 'Unauthorized') => {
    return res.status(401).json(errorResponse(message));
  };

  // Add forbidden response method
  res.forbidden = (message = 'Forbidden') => {
    return res.status(403).json(errorResponse(message));
  };

  next();
};

module.exports = responseHandler;