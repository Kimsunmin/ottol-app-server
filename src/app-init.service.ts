import { OnModuleInit } from '@nestjs/common';

export class appInitService implements OnModuleInit {
  onModuleInit() {
    console.log('Project init method');
  }
}
