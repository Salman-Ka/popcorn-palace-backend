// Note: This file is part of the default NestJS template.
// It was not used in the project implementation.
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
