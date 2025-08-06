import { databaseConfig } from './database.config';
import { ConfigService } from '@nestjs/config';

describe('databaseConfig', () => {
  it('should return config with defaults', () => {
    const configService = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as ConfigService;
    const config = databaseConfig(configService);
    expect(config.dialect).toBe('postgres');
  });
});