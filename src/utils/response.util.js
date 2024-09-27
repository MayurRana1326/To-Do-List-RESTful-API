const getSuccessResponse = (message, data) => {
  return {
    status: "success",
    message,
    data,
  };
};

const getFailureResponse = (message = "") => {
  return {
    status: "error",
    message,
  };
};

module.exports = { getFailureResponse, getSuccessResponse };
