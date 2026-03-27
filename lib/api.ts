export type ApiMessage = {
  message?: string;
  error?: string;
};

export async function parseJsonSafely<T>(
  response: Response
): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
