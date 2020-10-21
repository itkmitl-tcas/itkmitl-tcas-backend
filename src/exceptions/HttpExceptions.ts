import { Response } from 'express';

export function successResponse(message: string, DATA: any, res: Response) {
  res.status(200).json({
    STATUS: 'SUCCESS',
    MESSAGE: `${message} is successfully`,
    DATA,
  });
}

export function createdResponse(message: string, DATA: any, res: Response) {
  res.status(201).json({
    STATUS: 'CREATED',
    MESSAGE: `Resource ${message} has been created`,
    DATA,
  });
}

export function updatedResponse(message: string, DATA: any, res: Response) {
  res.status(200).json({
    STATUS: 'UPDATED',
    MESSAGE: `Resource ${message} has beed updated`,
    DATA,
  });
}

export function deletedResponse(message: string, DATA: any, res: Response) {
  res.status(200).json({
    STATUS: 'DELETED',
    MESSAGE: `Resource ${message} was successfully deleted`,
    DATA,
  });
}

export function notFoundResponse(message: string, res: Response) {
  res.status(404).json({
    STATUS: 'NOTFOUND',
    MESSAGE: `Resource ${message} could not be found`,
  });
}

export function failureResponse(message: string, DATA: any, res: Response) {
  res.status(500).json({
    STATUS: 'FAILURE',
    MESSAGE: `Something went wrong with ${message}`,
    DATA,
  });
}

export function insufficientParameters(DATA: any, res: Response) {
  res.status(400).json({
    STATUS: 'BAD REQUEST',
    MESSAGE: 'Insufficient parameters',
    DATA: DATA,
  });
}

export function mismatchResponse(status: number, message: string, res: Response) {
  res.status(status).json({
    STATUS: 'MISMATCH',
    MESSAGE: `Resource does not match with ${message}`,
  });
}

// export function unavailableResponse(res: Response) {
//   res.status(response_status_codes.internal_server_error).json({
//     STATUS: 'FAILURE',
//     MESSAGE: 'Service unavaiable',
//     DATA: {},
//   });
// }

// export function dbError(err: any, res: Response) {
//   res.status(response_status_codes.internal_server_error).json({
//     STATUS: 'FAILURE',
//     MESSAGE: 'DB error',
//     DATA: err,
//   });
// }
