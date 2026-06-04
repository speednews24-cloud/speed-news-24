export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Server error',
    errors: err.errors || undefined
  });
}
