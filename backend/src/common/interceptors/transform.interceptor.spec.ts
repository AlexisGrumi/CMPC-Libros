import { TransformInterceptor } from './transform.interceptor';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  it('should wrap data in { success: true, data }', (done) => {
    const interceptor = new TransformInterceptor();
    const mockHandler = {
      handle: () => of('test data'),
    };
    interceptor.intercept({} as any, mockHandler as any).subscribe((result) => {
      expect(result).toEqual({ success: true, data: 'test data' });
      done();
    });
  });
});