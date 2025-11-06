# @chitovas/ngx-clamp

![Build](https://github.com/Chitova263/ngx-clamp/workflows/main/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@chitovas/ngx-clamp.svg?style=flat-square)](https://www.npmjs.com/package/@chitovas/ngx-clamp)
![bundle size](https://img.shields.io/bundlephobia/minzip/@chitovas/ngx-clamp)
[![npm](https://img.shields.io/npm/dt/@chitovas/ngx-clamp.svg)](https://www.npmjs.com/package/@chitovas/ngx-clamp)

An Angular library that provides elegant text overflow management with support for legacy browsers. Clamp text content to a specific number of lines or maximum height, with customizable truncation indicators.

## Why ngx-clamp?

Modern CSS properties like `-webkit-line-clamp` and `line-clamp` aren't supported in older browsers. This library provides a cross-browser solution that works consistently everywhere, with additional features like custom truncation text and nested element support.

## Features

- ✨ **Simple Integration** - Single directive, no complex setup required
- 🎯 **Flexible Clamping** - Clamp by line count or maximum height
- 🎨 **Customizable Truncation** - Use ellipsis or custom text (e.g., "Read more...")
- 🏗️ **Nested HTML Support** - Works seamlessly with complex nested structures
- 🌐 **Universal Browser Support** - Reliable fallback for legacy browsers
- 📦 **Lightweight** - Minimal bundle size impact

## Installation

```bash
npm install @chitovas/ngx-clamp
```

## Quick Start

### 1. Import the Directive

```typescript
import { Component } from '@angular/core';
import { NgxClamp } from '@chitovas/ngx-clamp';

@Component({
    selector: 'app-example',
    standalone: true,
    imports: [NgxClamp],
    template: ` <div ngxClamp [lines]="3">Your long text content here...</div> `,
})
export class ExampleComponent {}
```

### 2. Basic Usage Examples

#### Clamp by Line Count

```html
<div ngxClamp [lines]="3">
    This text will be clamped to 3 lines. Any content exceeding this limit will be truncated and replaced with an ellipsis (...)
</div>
```

#### Clamp by Maximum Height

```html
<div ngxClamp [maxHeight]="100">
    This text will be clamped when it exceeds 100 pixels in height. The overflow content will be hidden with an ellipsis.
</div>
```

#### Custom Truncation Text

```html
<div ngxClamp [lines]="3" truncationText=" Read more...">
    This text will show "Read more..." instead of the default ellipsis when the content is clamped.
</div>
```

#### With Nested Elements

```html
<div ngxClamp [lines]="4" truncationText="...">
    <h3>Article Title</h3>
    <p>First paragraph with some content...</p>
    <p>Second paragraph that might get clamped...</p>
    <span>Additional nested content</span>
</div>
```

## API Reference

### Directive: `ngxClamp`

| Input            | Type     | Default | Description                                |
| ---------------- | -------- | ------- | ------------------------------------------ |
| `lines`          | `number` | -       | Number of lines to display before clamping |
| `maxHeight`      | `number` | -       | Maximum height in pixels before clamping   |
| `truncationText` | `string` | `'...'` | Text to display when content is clamped    |

**Note**: Use either `lines` or `maxHeight`, not both. If both are provided, `lines` takes precedence.

## Advanced Examples

### Article Preview Card

```typescript
@Component({
    selector: 'app-article-card',
    standalone: true,
    imports: [NgxClamp],
    template: `
        <article class="card">
            <h2>{{ article.title }}</h2>
            <div ngxClamp [lines]="3" truncationText=" [Read more]">
                {{ article.content }}
            </div>
        </article>
    `,
})
export class ArticleCardComponent {
    article = {
        title: 'Understanding Angular',
        content: 'Very long article content...',
    };
}
```

### Product Description

```html
<div class="product-info">
    <div ngxClamp [maxHeight]="120" truncationText="... See full description">
        <h4>Product Features</h4>
        <ul>
            <li>Feature one with detailed description</li>
            <li>Feature two with more information</li>
            <li>Feature three that might be hidden</li>
        </ul>
        <p>Additional product details and specifications...</p>
    </div>
</div>
```

### Dynamic Content

```typescript
@Component({
    selector: 'app-dynamic-clamp',
    standalone: true,
    imports: [NgxClamp],
    template: `
        <div ngxClamp [lines]="maxLines" [truncationText]="truncText">
            {{ dynamicContent }}
        </div>
        <button (click)="toggleExpand()">
            {{ expanded ? 'Show Less' : 'Show More' }}
        </button>
    `,
})
export class DynamicClampComponent {
    maxLines = 3;
    expanded = false;
    truncText = ' ...more';
    dynamicContent = 'Your long dynamic content...';

    toggleExpand() {
        this.maxLines = this.expanded ? 3 : 999;
        this.expanded = !this.expanded;
    }
}
```

## Browser Support

- ✅ Chrome (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Edge (all versions)
- ✅ IE11 and older legacy browsers

## Migration Guide

### From CSS line-clamp

**Before** (CSS only):

```css
.text {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```

**After** (with ngx-clamp):

```html
<div ngxClamp [lines]="3" class="text">Your content here</div>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 [Report Issues](https://github.com/Chitova263/ngx-clamp/issues)

---

Made with ❤️ by [@chitovas](https://github.com/Chitova263)
