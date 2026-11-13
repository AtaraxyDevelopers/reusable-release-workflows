import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
export function checkRelease(tag, version) {
  if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(tag ?? ''))
    throw new Error('Release tag must be vMAJOR.MINOR.PATCH, optionally with a prerelease suffix.');
  if (tag !== 'v' + version) throw new Error('Tag does not match package.json version');
  return true;
}
if (
  process.argv[1] &&
  fs.realpathSync(fileURLToPath(import.meta.url)) === fs.realpathSync(process.argv[1])
) {
  try {
    checkRelease(
      process.argv[2] ?? process.env.RELEASE_TAG,
      JSON.parse(fs.readFileSync('package.json', 'utf8')).version,
    );
    console.log('Release tag matches package version.');
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
