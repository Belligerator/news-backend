import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

/**
 * Pipe for checking if required parameter is present.
 */
export class RequiredParameterPipe implements PipeTransform {
    public transform(value: string, metadata: ArgumentMetadata): string {
        if (value === undefined || value === null) {
            throw new BadRequestException(`Required parameter '${metadata.data}' is missing.`)
        } else {
            return value;
        }
    }
}
