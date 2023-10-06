import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

/**
 * Pipe for transforming string to number.
 */
export class StringToNumberPipe implements PipeTransform {
    public transform(value: string, metadata: ArgumentMetadata): number | undefined {
        const numberValue: number = Number(value);
        if (isNaN(numberValue)) {
            return undefined
        }
        return numberValue;
    }
}
