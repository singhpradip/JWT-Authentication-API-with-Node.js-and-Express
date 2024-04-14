// For successful responses
const successResponse = (message, data = null) => {
  return { success: true, message, data };
};

// For error responses
const errorResponse = (message, statusCode = 500) => {
  return { success: false, message, statusCode };
};

module.exports = {
  successResponse,
  errorResponse,
};
