import { ErrorCode } from "./errorCodes";

class CustomError extends Error {
  status: number;
  code: ErrorCode;

  constructor(message: string, statusCode: number, code?: ErrorCode) {
    super(message);
    this.status = statusCode;
    this.code = code ?? "UNEXPECTED";
  }
}

export default CustomError;
