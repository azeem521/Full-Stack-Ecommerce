const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid path ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  err.message = err.message || "Internal server error!";

  // Wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    error: err,
    message: err.message,
  });
};
