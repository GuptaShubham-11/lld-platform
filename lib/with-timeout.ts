const EVAL_TIMEOUT_MS = 5000;

export function withTimeout<T>(
  promise: Promise<T>,
  ms: number = EVAL_TIMEOUT_MS
): Promise<T | 'TIMEOUT'> {
  return Promise.race([
    promise,
    new Promise<'TIMEOUT'>((resolve) => setTimeout(() => resolve('TIMEOUT'), ms)),
  ]);
}
