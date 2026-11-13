# Reusable Release Workflows

[![CI](https://github.com/AtaraxyDevelopers/reusable-release-workflows/actions/workflows/ci.yml/badge.svg)](https://github.com/AtaraxyDevelopers/reusable-release-workflows/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Reusable GitHub Actions workflows with a working Node.js package and release validation.

An open-source project from [Ataraxy Developers](https://github.com/AtaraxyDevelopers).

## Quick start

Install [Node.js](https://nodejs.org/en/download) 22 or 24 (npm is included). Check
`node --version` and `npm --version` in your terminal. The commands below run from
this repository's root folder, the one containing `package.json`.

**With Git:**

```sh
git clone https://github.com/AtaraxyDevelopers/reusable-release-workflows.git
cd reusable-release-workflows
npm ci
npm test
```

**Without Git:** choose **Code → Download ZIP** on GitHub, extract the archive,
and open a terminal in the extracted `reusable-release-workflows-main` folder (release archives may
include the version in the folder name). Run `npm ci` and `npm test` there.
Use the **source-code ZIP**, not an npm `.tgz` package, to follow this developer walkthrough.
The install step may need internet access; the examples run locally afterward.

On Windows PowerShell, if `npm.ps1` is blocked by execution policy, use `npm.cmd`
in place of `npm` in these commands. No execution-policy change is required.

```sh
npm run demo
npm run check:release -- v0.1.1
npm pack
```

The repository is both a reusable workflow collection and a small working package
with chunk and uniqueBy exports. The package is not published to npm. Install a
generated tarball in a separate consumer project with
`npm install ./ataraxydevelopers-reusable-release-workflows-0.1.1.tgz` after copying
the tarball into that project. Run that install in the consumer folder, not this
source checkout, so it does not add a self-dependency to the example package.

## Reuse the CI workflow

Create a caller workflow in another Node.js repository with package.json, a committed
package-lock.json, and a test script:

```yaml
name: CI
on: [push, pull_request]
permissions:
  contents: read
jobs:
  test:
    uses: AtaraxyDevelopers/reusable-release-workflows/.github/workflows/node-ci.yml@v0.1.1
    with:
      node-versions: '[22, 24]'
```

For stronger reproducibility, replace the release tag with its full commit SHA.
The reusable workflow checks out **the caller repository** and tests its root npm
package on Windows, macOS, and Linux. Monorepo subdirectories and other package
managers are outside this first release's scope.

## Reuse the release workflow

The caller needs a root `package.json`, a committed `package-lock.json`, a working
`npm test` script, and `CHANGELOG.md`. **No helper script needs to be copied.**
Create `.github/workflows/release.yml` in that caller repository:

```yaml
name: Release
on:
  push:
    tags: ['v*']
permissions:
  contents: read
jobs:
  verify:
    uses: AtaraxyDevelopers/reusable-release-workflows/.github/workflows/node-ci.yml@v0.1.1
  release:
    needs: verify
    permissions:
      contents: write
    uses: AtaraxyDevelopers/reusable-release-workflows/.github/workflows/package-release.yml@v0.1.1
```

For immutable references, replace each version tag with its full commit SHA.
The workflow checks out the caller's source, runs its tests on the supported matrix,
validates its version, packages its source, and creates a release in the caller's
repository. The release job needs contents:write; CI needs only contents:read.
The caller's repository policies must allow these workflows and GitHub releases.

For a real release, update package.json and the lockfile, update CHANGELOG.md, run
the tests, and commit the changes. Then create and push the matching version tag.
For example, after committing version 1.2.3:

```sh
git tag v1.2.3
git push origin v1.2.3
```

Those two commands publish a tag and trigger a GitHub release; they are not part of
the local quick start. No npm token is required and nothing is published to npm.
An existing release is not overwritten; use a new version for changed artifacts.

The [Backend Recipes caller](https://github.com/AtaraxyDevelopers/tested-backend-recipes/blob/main/.github/workflows/release.yml)
uses this exact external workflow pattern. This is also exercised during the 0.1.1 release review.

## Scope and validation

This first version assumes a trusted package manifest and standard npm lifecycle
scripts. Unit tests check package behavior and tag validation. The repository's own
CI invokes the reusable CI workflow, and its release tag exercises the release
workflow end to end. Action dependencies are pinned to full commit SHAs.

## Expected first run

The demo prints chunked and deduplicated arrays. Release validation prints `Release tag matches package version.` The pack command creates a local `.tgz` file; it does not publish anything.

## Contributing and support

See [CONTRIBUTING.md](CONTRIBUTING.md), [community expectations](CODE_OF_CONDUCT.md),
and [SECURITY.md](SECURITY.md). Open an issue with a minimal synthetic reproduction.
This project is maintained on a best-effort basis. No paid service or account is
required to run the local examples.

## License

[MIT](LICENSE). You may use, adapt, and redistribute this project under its license.
