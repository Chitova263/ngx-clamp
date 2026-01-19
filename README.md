# @chitovas/ngx-clamp

[![NPM version](https://img.shields.io/npm/v/@chitovas/ngx-clamp.svg?style=flat-square)](https://www.npmjs.com/package/@chitovas/ngx-clamp)
![bundle size](https://img.shields.io/bundlephobia/minzip/@chitovas/ngx-clamp)
[![npm](https://img.shields.io/npm/dt/@chitovas/ngx-clamp.svg)](https://www.npmjs.com/package/@chitovas/ngx-clamp)

A lightweight Angular directive for clamping text by line count or height. Cross-browser compatible, including legacy browsers where CSS `line-clamp` isn't supported.

## Installation

```bash
npm install @chitovas/ngx-clamp
```

## Usage

```typescript
import { NgxClamp } from '@chitovas/ngx-clamp';

@Component({
    standalone: true,
    imports: [NgxClamp],
    template: `
        <!-- Clamp by lines -->
        <p ngxClamp [lines]="3">Long text content...</p>

        <!-- Clamp by height -->
        <p ngxClamp [maxHeight]="100">Long text content...</p>

        <!-- Custom truncation text -->
        <p ngxClamp [lines]="2" truncationText=" Read more...">Long text content...</p>
    `,
})
export class MyComponent {}
```

## API

### Inputs

| Input            | Type     | Default | Description                              |
| ---------------- | -------- | ------- | ---------------------------------------- |
| `lines`          | `number` | -       | Number of lines before clamping          |
| `maxHeight`      | `number` | -       | Maximum height (px) before clamping      |
| `truncationText` | `string` | `'...'` | Text appended when content is truncated  |

> Use either `lines` or `maxHeight`. If both are set, `lines` takes precedence.

### Outputs

| Output    | Type                   | Description                                        |
| --------- | ---------------------- | -------------------------------------------------- |
| `clamped` | `EventEmitter<boolean>`| Emits `true` if truncated, `false` if content fits |

```html
<p ngxClamp [lines]="3" (clamped)="onClamped($event)">Long text...</p>
```

## Browser Support

Chrome, Firefox, Safari, Edge, and IE11+.

## License

[MIT](LICENSE)
