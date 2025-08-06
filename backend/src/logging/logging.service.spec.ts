import { LoggingService } from './logging.service';
import { Logger } from '@nestjs/common';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    service = new LoggingService();
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log action with details', () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log');
    service.logAction('Test action', { id: 1 });

    expect(logSpy).toHaveBeenCalledWith('Test action - {"id":1}');
  });

  it('should log action without details', () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log');
    service.logAction('Test action');

    expect(logSpy).toHaveBeenCalledWith('Test action - undefined');
  });
});
