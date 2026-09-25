# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0]

### Breaking

- Dropped Vue 2 support — `vue-demi`/`@vue/composition-api` removed, `vue` peer dependency is now `^3.5.0`. Vue 2 projects should stay on the `legacy` branch / `^0.6.0`.
- `<DialogsWrapper/>` is removed. The library now auto-mounts its own render root into `document.body` on first `reveal()` — delete `<DialogsWrapper/>` from your app's template.

### Added

- Dialogs are now rendered through `<TransitionGroup>`, so CSS-based exit transitions work without any extra setup (complements the `closeDelay` option added in `0.6.0`).
- Installing the plugin (`app.use(ConfirmDialog)`) now gives dialog components access to the host app's plugins/provides via `inject()` — previously they rendered in an isolated context.

### Changed

- `install()` is now recommended (not required) — without it dialogs still render, just without inherited app context.
- Updated `@vueuse/core` to latest (12+, Vue-3-only).

## [0.6.0]

Last release to support Vue 2 (via `vue-demi`) — a Vue 3-only `1.0.0` is coming next.

### Fixed

- TypeScript error when calling `createConfirmDialog()` with a component that has default prop values ([#31](https://github.com/harmyderoman/vuejs-confirm-dialog/issues/31))
- Dialog removal could silently fail to fire when `reveal()` was immediately followed by `confirm()`/`cancel()`/`close()` with no tick in between (Vue's default watcher batching coalesced the change) — the watcher now uses `flush: 'sync'`
- Loose `==` comparison when removing a dialog from the internal store, replaced with `===`

### Added

- `closeDelay` option — delays unmounting the dialog component after confirm/cancel/close, so exit transitions have time to finish ([#34](https://github.com/harmyderoman/vuejs-confirm-dialog/issues/34))

### Changed

- Updated dependencies to the latest versions still compatible with Vue 2 (`@vueuse/core` → 11.3.0, `vue-demi` → 0.14.10, dev tooling to latest)
- Restored CI (lint + build + test on push/PR)

[1.0.0]: https://github.com/harmyderoman/vuejs-confirm-dialog/releases/tag/v1.0.0
[0.6.0]: https://github.com/harmyderoman/vuejs-confirm-dialog/releases/tag/v0.6.0
