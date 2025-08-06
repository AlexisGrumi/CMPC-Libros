import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger('Audit');

  logAction(action: string, details?: any) {
    this.logger.log(`${action} - ${JSON.stringify(details)}`);
  }
}
