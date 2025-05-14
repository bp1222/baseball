/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export default function memoize<T extends (...args: any) => any>(callback: T, resolver?: (...args: Parameters<T>) => string|false): T {
  const cache = new Map<string, ReturnType<T>>()
  return function (...args: Parameters<T>) {
    const key = resolver ? resolver(...args) : JSON.stringify(args)
    if (key === false) {
      return callback(...args)
    }

    if (!cache.has(key)) {
      cache.set(key, callback(...args))
    }

    return cache.get(key)
  } as T
}