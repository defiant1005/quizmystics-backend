export class ApiError extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static BadRequest(message: string): ApiError {
    return new ApiError(404, message);
  }

  static Unauthorized(message: string): ApiError {
    return new ApiError(403, message);
  }

  static Internal(message: string): ApiError {
    return new ApiError(500, message);
  }
}
