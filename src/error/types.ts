export interface IResponseError {
  error: {
    message: string;
  };
}

export interface IZodError {
  field: string;
  message: string;
}
