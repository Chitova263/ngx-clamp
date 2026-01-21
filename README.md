# @chitovas/ngx-clamp

![Build](https://github.com/Chitova263/ngx-clamp/workflows/main/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@chitovas/ngx-clamp.svg?style=flat-square)](https://www.npmjs.com/package/@chitovas/ngx-clamp)
![bundle size](https://img.shields.io/bundlephobia/minzip/@chitovas/ngx-clamp)
[![npm](https://img.shields.io/npm/dt/@chitovas/ngx-clamp.svg)](https://www.npmjs.com/package/@chitovas/ngx-clamp)

A lightweight Angular directive for clamping text to a specified number of lines or height. A fast, cross-browser alternative to CSS `line-clamp` that works in all browsers, including legacy browsers where native support is unavailable.

- **Fast** - Uses binary search algorithm for O(log n) truncation performance
- **Universal** - Works across all browsers including IE11 and older
- **Lightweight** - Zero dependencies, tree-shakeable

## Installation

```bash
npm install @chitovas/ngx-clamp
```

## Usage

```typescript
import { Component } from '@angular/core';
import { NgxClamp } from '@chitovas/ngx-clamp';

@Component({
    selector: 'app-example',
    standalone: true,
    imports: [NgxClamp],
    template: `
        <div ngxClamp [lines]="3">
            Long text content that will be clamped...
        </div>
    `,
})
export class ExampleComponent {}
```

### Clamp by Height

```html
<div ngxClamp [maxHeight]="100">
    Content clamped at 100px height...
</div>
```

### Custom Truncation Text

```html
<div ngxClamp [lines]="3" truncationText=" Read more...">
    Content with custom truncation indicator...
</div>
```

## API

| Input              | Type     | Default | Description                              |
| ------------------ | -------- | ------- | ---------------------------------------- |
| `lines`            | `number` | -       | Number of lines before clamping          |
| `maxHeight`        | `number` | -       | Maximum height (px) before clamping      |
| `truncationText`   | `string` | `'...'` | Text appended to clamped content         |

Use either `lines` or `maxHeight`. If both are provided, `lines` takes precedence.

## License

MIT
