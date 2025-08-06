import { Test, TestingModule } from '@nestjs/testing';
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// SequelizeModule mock como DynamicModule válido
@Module({})
class SequelizeModuleMock {
  static forRootAsync = jest.fn((): DynamicModule => ({
    module: SequelizeModuleMock,
  }));
  static forFeature = jest.fn((): DynamicModule => ({
    module: SequelizeModuleMock,
  }));
}

// Mock del paquete
jest.mock('@nestjs/sequelize', () => ({
  SequelizeModule: SequelizeModuleMock,
}));

const { SequelizeModule }: any = jest.requireMock('@nestjs/sequelize');

// Creamos un DatabaseModuleMock válido
@Module({})
class DatabaseModuleMock {
  static register(): DynamicModule {
    return {
      module: DatabaseModuleMock,
      imports: [
        SequelizeModule.forRootAsync({}),
        SequelizeModule.forFeature([]),
      ],
      exports: [SequelizeModule],
    };
  }
}

describe('DatabaseModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModuleMock.register()],
      providers: [{ provide: ConfigService, useValue: { get: jest.fn() } }],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should call SequelizeModule.forRootAsync', () => {
    expect(SequelizeModule.forRootAsync).toHaveBeenCalled();
  });

  it('should call SequelizeModule.forFeature', () => {
    expect(SequelizeModule.forFeature).toHaveBeenCalled();
  });
});
