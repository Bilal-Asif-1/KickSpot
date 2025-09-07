
export const successResponse = (message = 'Operation successful', data = {}, statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    statusCode
  };
};


export const errorResponse = (message = 'Operation failed', statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    statusCode,
    ...(errors && { errors })
  };
};


export const paginationResponse = (data = [], page = 1, limit = 10, total = 0, message = 'Data retrieved successfully') => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? parseInt(page) + 1 : null,
      prevPage: hasPrevPage ? parseInt(page) - 1 : null
    }
  };
};