export interface ApplicationError {
  details: {
    applicationError: {
      code: string;
    };
  };
}

export function isApplicationError(error: unknown): error is ApplicationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "details" in error &&
    typeof (error as { details?: unknown }).details === "object" &&
    "applicationError" in
      (error as { details: { applicationError?: unknown } }).details &&
    typeof (error as { details: { applicationError: { code?: unknown } } })
      .details.applicationError === "object" &&
    typeof (error as { details: { applicationError: { code: unknown } } })
      .details.applicationError.code === "string"
  );
}
