import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { insufficientParameters } from '../exceptions/HttpExceptions';
import * as express from 'express';

function ValidateMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)[0]);
        insufficientParameters(message, res);
      } else {
        next();
      }
    });
  };
}

export default ValidateMiddleware;
