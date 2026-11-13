import { chunk, uniqueBy } from '../src/index.mjs';
console.log('Chunks:', chunk([1, 2, 3, 4, 5], 2));
console.log(
  'Unique:',
  uniqueBy([{ id: 'a' }, { id: 'a' }, { id: 'b' }], (item) => item.id),
);
