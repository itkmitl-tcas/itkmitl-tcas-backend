import multiparty from 'multiparty';
import fs from 'fs';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { insufficientParameters } from '../exceptions/HttpExceptions';
import * as express from 'express';
import Busboy from 'busboy';

function ValidateMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
  return async (req, res, next) => {
    const header = req.header('Content-Type');
    if (header == 'application/json') {
      validate(plainToClass(type, req.body), { skipMissingProperties }).then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints)[0]);
          insufficientParameters(message, res);
        } else {
          next();
        }
      });
    } else if (header.split(';')[0] == 'multipart/form-data') {
      next();
      // const busboy = new Busboy({ headers: req.headers });
      // const body: Record<string, any> = {};
      // busboy.on('file', (field, file, name, encoding, mime) => {
      //   body[field] = { fieldname: field, name: name, file, fileencoding: encoding, mimeType: mime };
      //   // file.resume();
      // });
      // busboy.on('field', (field, val) => {
      //   body[field] = val;
      // });
      // busboy.on('finish', () => {
      //   validate(plainToClass(type, body), { skipMissingProperties }).then((errors: ValidationError[]) => {
      //     if (errors.length > 0) {
      //       const message = errors.map((error: ValidationError) => Object.values(error.constraints)[0]);
      //       insufficientParameters(message, res);
      //     } else {
      //       next();
      //     }
      //   });
      // });
      // req.pipe(busboy);
    } else {
      next();
    }
  };
}

export default ValidateMiddleware;
