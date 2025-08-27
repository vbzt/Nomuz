import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseCUIDPipe implements PipeTransform {
  transform(value: string | string[], metadata: ArgumentMetadata): string | string[] {
    const cuidRegex = /^c[^\s-]{24}$|^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
    const values = Array.isArray(value) ? value : [value]

    for (const v of values) {
      if (!cuidRegex.test(v)) {
        throw new BadRequestException(`ID fornecido não é um CUID válido: ${v}`)
      }
    }

    return values.length === 1 ? values[0] : values
  }
}
