# Reusable Release Workflows

[![CI](https://github.com/AtaraxyDevelopers/reusable-release-workflows/actions/workflows/ci.yml/badge.svg)](https://github.com/AtaraxyDevelopers/reusable-release-workflows/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Reusable GitHub Actions workflows with a working Node.js package and release validation.

An open-source project from [Ataraxy Developers](https://github.com/AtaraxyDevelopers).

## Quick start

Requires Node.js 22 or 24 and npm. Git is optional if you download the source ZIP.

```sh
git clone https://github.com/AtaraxyDevelopers/reusable-release-workflows.git
cd reusable-release-workflows
npm ci
npm test
```

```sh
npm run demo
npm run check:release -- v0.1.0
npm pack
```

The repository is both a reusable workflow collection and a small working package
with chunk and uniqueBy exports. The package is not published to npm. Install a
generated tarball locally with `npm install ./ataraxydevelopers-reusable-release-workflows-0.1.0.tgz`.

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
    uses: AtaraxyDevelopers/reusable-release-workflows/.github/workflows/node-ci.yml@v0.1.0
    with:
      node-versions: '[22, 24]'
```

For stronger reproducibility, replace the release tag with its full commit SHA.
The reusable workflow checks out **the caller repository** and tests its root npm
package on Windows, macOS, and Linux. Monorepo subdirectories and other package
managers are outside this first release's scope.

## Reuse the release workflow

Copy scripts/check-release.mjs and maintain CHANGELOG.md in the caller. Use
the pattern in [.github/workflows/release.yml](.github/workflows/release.yml), replacing
local workflow paths with this repository's versioned references. The release job
requires contents:write; CI only requires contents:read. Repository policies must
allow GitHub Actions and GitHub releases.

Update package.json and its lockfile, run the tests, commit, then push a matching
vMAJOR.MINOR.PATCH tag. The workflow validates the version, creates an npm tarball,
uploads a workflow artifact, and attaches the tarball to a GitHub release. It does
not publish to npm and needs no npm token. A duplicate release fails visibly rather
than overwriting an existing release; use a new version for changed artifacts.

## Scope and validation

This first version assumes a trusted package manifest and standard npm lifecycle
scripts. Unit tests check package behavior and tag validation. The repository's own
CI invokes the reusable CI workflow, and its release tag exercises the release
workflow end to end. Action dependencies are pinned to full commit SHAs.

## Contributing and support

See [CONTRIBUTING.md](CONTRIBUTING.md), [community expectations](CODE_OF_CONDUCT.md),
and [SECURITY.md](SECURITY.md). Open an issue with a minimal synthetic reproduction.
This project is maintained on a best-effort basis. No paid service or account is
required to run the local examples.

## License

[MIT](LICENSE). You may use, adapt, and redistribute this project under its license.
