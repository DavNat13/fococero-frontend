import { delay, withRetry } from '../async';

describe('delay (retardo)', () => {
  it('se resuelve después del tiempo especificado', async () => {
    const start = Date.now();
    await delay(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(45);
  });
});

describe('withRetry (reintento)', () => {
  it('retorna el resultado en éxito', async () => {
    const operation = jest.fn().mockResolvedValue('ok');
    await expect(withRetry(operation)).resolves.toBe('ok');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('reintenta en fallo y eventualmente tiene éxito', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('ok');

    await expect(withRetry(operation, 3, 10)).resolves.toBe('ok');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('lanza error si se agotan los reintentos', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('permanent failure'));
    await expect(withRetry(operation, 2, 10)).rejects.toThrow('permanent failure');
    expect(operation).toHaveBeenCalledTimes(3);
  });
});
