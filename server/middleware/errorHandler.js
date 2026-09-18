/**
 * Centralized Application Error Handling Middleware
 * Sanitizes errors, formats user-friendly messages, prevents stack trace exposure
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'An unexpected error occurred. Please try again.';

  // Mongoose bad ObjectId / CastError
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Requested resource not found (invalid identifier).';
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account or record with that ${field} already exists.`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join('. ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please sign in again.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  // Log in development only
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { errorHandler };
