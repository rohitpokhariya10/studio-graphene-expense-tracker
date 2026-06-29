//CUstom error class
export const createHttpError = (statusCode, message, details = undefined) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  if (details) {
    error.details = details;
  }
  

  return error;
};
