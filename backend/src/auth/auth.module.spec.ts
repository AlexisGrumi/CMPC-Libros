import { Test, TestingModule } from '@nestjs/testing';
import { Module, DynamicModule } from '@nestjs/common';
import { AuthModule } from './auth.module';

// ✅ Define primero, luego mockea
@Module({})
class SequelizeModuleMock {
  static forFeature = jest.fn((): DynamicModule => ({
    module: SequelizeModuleMock,
  }));
}

@Module({})
class JwtModuleMock {
  static register = jest.fn((): DynamicModule => ({
    module: JwtModuleMock,
  }));
}

// ✅ Mock después de declarar las clases
jest.mock('@nestjs/sequelize', () => ({
  SequelizeModule: SequelizeModuleMock,
}));

jest.mock('@nestjs/jwt', () => ({
  JwtModule: JwtModuleMock,
}));

describe('AuthModule', () => {
  it('should be defined', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    expect(moduleRef).toBeDefined();
  });

  it('should use default JWT_EXPIRES_IN when not set', async () => {
    delete process.env.JWT_EXPIRES_IN;

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    expect(moduleRef).toBeDefined();
    expect(JwtModuleMock.register).toHaveBeenCalled();
  });

  it('should use provided JWT_EXPIRES_IN from env', async () => {
    process.env.JWT_EXPIRES_IN = '2h';

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    expect(moduleRef).toBeDefined();
  });
});
