import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chunk, uniqueBy } from '../src/index.mjs';
import { checkRelease } from '../scripts/check-release.mjs';
test('chunk preserves inputs, order, empty and partial chunks', () => {
  const input = [1, 2, 3, 4, 5];
  assert.deepEqual(chunk(input, 2), [[1, 2], [3, 4], [5]]);
  assert.deepEqual(input, [1, 2, 3, 4, 5]);
  assert.deepEqual(chunk([], 2), []);
  assert.throws(() => chunk(input, 0));
});
test('uniqueBy preserves the first item for arbitrary keys', () => {
  const first = { id: '__proto__', value: 1 };
  assert.deepEqual(
    uniqueBy([first, { id: '__proto__', value: 2 }, { id: 'b' }], (x) => x.id),
    [first, { id: 'b' }],
  );
});
test('release validation blocks mismatched and malformed tags', () => {
  assert.equal(checkRelease('v0.1.0', '0.1.0'), true);
  assert.throws(() => checkRelease('v0.2.0', '0.1.0'));
  assert.throws(() => checkRelease('$(bad)', '0.1.0'));
  assert.throws(() => checkRelease(undefined, '0.1.0'));
});
