/* eslint-disable @typescript-eslint/no-explicit-any */
export function coerceObject<T>(value: T | string | undefined | null): T | undefined {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch (e) {
      console.error('Failed to parse string:', value, e);
      return undefined;
    }
  }
  return value ?? undefined;
}
