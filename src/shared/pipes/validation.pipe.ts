import { ValidationError, ValidationPipe } from '@nestjs/common';
import { BadValidationRequestException } from 'src/models/exceptions/bad-validation-request.exception';

/**
 * Validate if request body is valid according to DTO.
 */
export class CustomValidationPipe extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            exceptionFactory: (errors: ValidationError[]) => new BadValidationRequestException(errors),
        });
    }
}
