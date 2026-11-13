import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
test('release validation runs in a caller with only package.json and rejects a mismatched tag', async (t) => {
  const workflow = await fs.readFile('.github/workflows/package-release.yml', 'utf8');
  const match = workflow.match(/<<'RELEASE_VALIDATION'\r?\n([\s\S]*?)\r?\n\s+RELEASE_VALIDATION/);
  assert.ok(match, 'inline validation block must exist');
  const source = match[1]
    .split('\n')
    .map((line) => line.trimStart())
    .join('\n');
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'release-caller-'));
  t.after(() => fs.rm(cwd, { recursive: true, force: true }));
  await fs.writeFile(
    path.join(cwd, 'package.json'),
    JSON.stringify({ name: 'caller', version: '1.2.3' }),
  );
  const run = (tag) =>
    spawnSync(process.execPath, ['--input-type=module', '-e', source], {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, RELEASE_TAG: tag },
    });
  assert.equal(run('v1.2.3').status, 0);
  assert.equal(run('v1.2.4').status, 1);
  assert.equal(run('invalid').status, 1);
  assert.ok(!workflow.includes('run: node scripts/check-release.mjs'));
});
