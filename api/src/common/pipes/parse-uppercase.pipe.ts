import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseUppercasePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {

    return value.toUpperCase()
  }
}