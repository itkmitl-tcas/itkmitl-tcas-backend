class HttpException extends Error {
  status: number;
  message: string;
  error: Error;
  constructor(status: number, message: string, error: Error = null) {
    super(message);
    this.status = status;
    this.message = message;
    this.error = error;
  }
}

export default HttpException;
