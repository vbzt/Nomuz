import { readFileSync } from 'fs';
import { join } from 'path';
import * as Handlebars from 'handlebars';

export function renderTemplate(templateName: string, data: Record<string, any>) {
  const filePath = join(process.cwd(), 'src', 'common', 'mail', 'templates', `${templateName}.hbs`);
  const source = readFileSync(filePath, 'utf8');
  const compiled = Handlebars.compile(source);
  return compiled(data);
}
