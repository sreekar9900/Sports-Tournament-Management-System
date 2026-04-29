const ApiError = require("../utils/apiError");

const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, "You are not allowed to perform this action"));
  }

  return next();
};

module.exports = roleMiddleware;
