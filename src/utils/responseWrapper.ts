const successResponse = (message: string, data: any = null) => ({
  success: true,
  message,
  data,
});

const errorResponse = (message: string, error: any = null) => ({
  success: false,
  message,
  error,
});

export default {successResponse, errorResponse};