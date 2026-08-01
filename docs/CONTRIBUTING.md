# Contributing

Keep Sauron smaller than the code it replaces. Before adding an abstraction or dependency, show the measured consumer problem and why Three, the browser platform, or a few local lines cannot solve it.

## Development

Requirements: Node 24+, npm, and stable Rust.

```sh
npm ci
npm run check
npm run benchmark
```

Pull requests must include a focused rationale, tests for non-trivial logic, before/after bundle bytes, and a reduced-motion or static state for moving effects. Do not copy demo code without a compatible licence.

## Branches and commits

Human branch names must be one lowercase word such as `prism` or `budget`. Dependabot and release automation are exempt because GitHub controls their prefixes. Use clear imperative commit subjects.

Before enabling releases on a new remote, maintainers must enable private vulnerability reporting and branch protection, bootstrap the npm package, configure its `release.yml` trusted publisher and `npm` environment, and optionally provide `RELEASE_TOKEN` so release-plz pull requests trigger protected checks. Only then set the repository variable `RELEASE_ENABLED=true`; every release job remains safely skipped without it.

## Scope

Sauron may own engine-neutral render policy and small Three effects. It must not own an application canvas, scene graph, React lifecycle, navigation, product content, or speculative engine adapters.
