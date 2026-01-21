# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Improved truncation performance with binary search algorithm (O(n) → O(log n))
- Refactored code for better readability and maintainability

### Fixed
- Fixed line height calculation for decimal font sizes
- Fixed re-clamping when `lines` or `maxHeight` inputs change dynamically
- Fixed `getComputedStyle` API usage

## [0.2.2] - 2024-01-15

### Added
- Demo application showcasing all features

## [0.2.1] - 2024-01-10

### Added
- Support for clamping by number of lines via `lines` input

### Fixed
- Typos in package name in README

## [0.2.0] - 2024-01-05

### Added
- Initial public release
- `ngxClamp` directive for text clamping
- Support for `maxHeight` constraint
- Support for custom `truncationCharacters`
- Cross-browser compatibility including legacy browsers

[Unreleased]: https://github.com/Chitova263/ngx-clamp/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/Chitova263/ngx-clamp/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/Chitova263/ngx-clamp/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Chitova263/ngx-clamp/releases/tag/v0.2.0
