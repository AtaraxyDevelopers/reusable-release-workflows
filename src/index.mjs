// A small real package used to exercise test -> package -> release.
export function chunk(items, size) {
  if (!Array.isArray(items)) throw new TypeError('items must be an array');
  if (!Number.isInteger(size) || size < 1) throw new RangeError('size must be a positive integer');
  const result = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}
export function uniqueBy(items, key) {
  if (!Array.isArray(items) || typeof key !== 'function')
    throw new TypeError('Expected an array and key function');
  const seen = new Set();
  return items.filter((item) => {
    const id = key(item);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
