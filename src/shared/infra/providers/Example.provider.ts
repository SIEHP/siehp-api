import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleProvider {
  async getExample() {
    return 'Hello World!';
  }
}
