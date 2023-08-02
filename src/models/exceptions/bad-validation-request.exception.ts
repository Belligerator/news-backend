import { BadRequestException, ValidationError } from '@nestjs/common';

/**
  * An error that will be returned if some mandatory attribute is missing from the Article.
  * The error is returned by the validator that checks the request.
  */
export class BadValidationRequestException extends BadRequestException {
    constructor(errors: ValidationError[]) {
        const properties: string[] = [];

        // List of mandatory attributes that are missing.
        errors.forEach((error: ValidationError) => {
            properties.push(error.property);
        });

        const message: string = properties.length == 0
            ? 'Unexpected error while validating request parameters.'
            : 'Missing mandatory parameter(s): ' + properties.join(', ');

        super({
            response: 0,
            message: message,
        });
    }
}
