export const getFriendlyErrorMessage = (error, fallback = 'Something went wrong') => {
  const backendMessage = error?.response?.data?.message;

  if (backendMessage) return backendMessage;

  const status = error?.response?.status;

  if (status === 401) return 'Invalid email or password';
  if (status === 403) return 'You do not have permission to complete this action';
  if (status === 404) return 'The requested item was not found';
  if (status === 429) return 'Too many requests. Please wait a moment and try again';

  return error?.message || fallback;
};