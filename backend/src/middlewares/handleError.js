const createError = require("http-errors");
const badRequest = (req, res) => {
  const error = createError.BadRequest(req);
  res.status(error.status).json({ err: 1, message: error.message });
};

const forbiddenRequest = (err, res) => {
  const error = createError.Forbidden(err);
  res.status(error.status).json({ err: 1, message: error.message });
};

const internalServerError = (err, res) => {
  const error = createError.InternalServerError(err);
  res.status(error.status).json({ err: 1, message: error.message });
};

const notFoundRoute = (req, res) => {
  const error = createError.NotFound("Route not found");
  res.status(error.status).json({ err: 1, message: error.message });
};

const notFound = (err, res) => {
  const error = createError.NotFound(err);
  res.status(error.status).json({ err: 1, message: error.message });
};

module.exports = {
  badRequest,
  internalServerError,
  notFoundRoute,
  forbiddenRequest,
  notFound,
};
