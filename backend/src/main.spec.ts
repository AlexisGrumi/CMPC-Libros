import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './swagger/swagger.config';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// Mock dependencias globales
jest.mock('@nestjs/core');
jest.mock('./swagger/swagger.config');
jest.mock('cookie-parser', () => jest.fn(() => 'cookieParser'));
jest.mock('@nestjs/platform-express');

describe('main.ts', () => {
  it('should bootstrap the application', async () => {
    const use = jest.fn();
    const useGlobalInterceptors = jest.fn();
    const useGlobalFilters = jest.fn();
    const useStaticAssets = jest.fn();
    const enableCors = jest.fn();
    const listen = jest.fn();
    const getHttpAdapter = jest.fn();

    const mockApp: Partial<NestExpressApplication> = {
      use,
      useGlobalInterceptors,
      useGlobalFilters,
      useStaticAssets,
      enableCors,
      listen,
      getHttpAdapter,
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);

    // Importa dinámicamente tu función bootstrap
    const { default: bootstrap } = await import('./main');

    // Ejecuta
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);

    expect(use).toHaveBeenCalledWith('cookieParser');
    expect(useGlobalInterceptors).toHaveBeenCalledWith(expect.any(TransformInterceptor));
    expect(useGlobalFilters).toHaveBeenCalledWith(expect.any(AllExceptionsFilter));

    expect(useStaticAssets).toHaveBeenCalledWith(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });

    expect(enableCors).toHaveBeenCalledWith({
      origin: 'http://localhost:5173',
      credentials: true,
    });

    expect(setupSwagger).toHaveBeenCalledWith(mockApp);
    expect(listen).toHaveBeenCalledWith(process.env.PORT || 3001);
  });
});
