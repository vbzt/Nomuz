import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseCUIDPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    const cuidRegex = /^c[^\s-]{24}$/;
    if (!cuidRegex.test(value)) throw new BadRequestException('ID fornecido não é um CUID válido.');
    return value 
  }
}