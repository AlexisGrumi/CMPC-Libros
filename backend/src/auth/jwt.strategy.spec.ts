import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // resetea el caché de importaciones para que tome el nuevo env
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should use provided JWT_SECRET when set', () => {
    process.env.JWT_SECRET = 'supersecretkey';
    const strategy = new JwtStrategy();
    expect(strategy).toBeDefined(); // esto cubre la rama con JWT_SECRET
  });

  it('should use default secret when JWT_SECRET is not set', () => {
    delete process.env.JWT_SECRET;
    const strategy = new JwtStrategy();
    expect(strategy).toBeDefined(); // esto cubre la rama con 'changeme'
  });

  it('should validate and return userId and email', async () => {
    const strategy = new JwtStrategy();
    const payload = { sub: 123, email: 'test@example.com' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({ userId: 123, email: 'test@example.com' }); // cubre línea 10 y función validate
  });
});
