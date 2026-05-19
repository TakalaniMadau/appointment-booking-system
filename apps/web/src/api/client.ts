export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  public readonly code: string | null;

  public readonly body: unknown | undefined;

  public readonly status: number;

  constructor(
    message: string,
    status: number,
    body?: unknown,
    code: string | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.body = body;
    this.status = status;
  }
}

const getApiErrorDetails = (body: unknown) => {
  if (!body || typeof body !== "object") {
    return {
      code: null,
      message: null,
    };
  }

  const code =
    "code" in body && typeof body.code === "string" ? body.code : null;
  const message =
    "message" in body && typeof body.message === "string" ? body.message : null;

  return {
    code,
    message,
  };
};

export const api = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let body: unknown;

    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }

    const errorDetails = getApiErrorDetails(body);

    throw new ApiError(
      errorDetails.message ?? `Request to ${path} failed`,
      response.status,
      body,
      errorDetails.code,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
