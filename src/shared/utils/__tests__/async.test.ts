import { delay, withRetry } from '../async';

describe('delay', () => {
  it('resolves after the specified time', async () => {
    const start = Date.now();
    await delay(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(45);
  });
});

describe('withRetry', () => {
  it('returns the result on success', async () => {
    const operation = jest.fn().mockResolvedValue('ok');
    await expect(withRetry(operation)).resolves.toBe('ok');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and eventually succeeds', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('ok');

    await expect(withRetry(operation, 3, 10)).resolves.toBe('ok');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('throws if all retries are exhausted', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('permanent failure'));
    await expect(withRetry(operation, 2, 10)).rejects.toThrow('permanent failure');
    expect(operation).toHaveBeenCalledTimes(3);
  });
});
