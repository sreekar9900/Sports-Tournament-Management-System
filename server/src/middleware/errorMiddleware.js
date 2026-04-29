const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.code === 11000) {
    statusCode = 400;
    message = "A record with the same unique value already exists";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier supplied";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    message
  });
};

module.exports = errorMiddleware;
