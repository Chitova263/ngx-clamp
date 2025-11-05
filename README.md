# @chitova/ngx-clamp

Welcome to @chitova/ngx-clamp, an Angular library designed to elegantly manage text overflow within HTML elements. This library allows you to clamp text, adding ellipsis or a truncation text of your choice when the content exceeds a specified height.

# Motivation

Solves overflow issues on older legacy browsers that don't support the `-webkit-line-clamp` or `line-clamp` property, ensuring consistent behavior across different platforms.

## Features

- **Easy Integration**: Seamlessly integrate `ngx-clamp` directive into your Angular applications to manage text overflow.
- **Customizable Truncation**: Use ellipsis or specify your own truncation text for clamped content.
- **Nested Element Support**: Clamp text within nested HTML elements effortlessly.
- **Height Configuration**: Set a maximum height for text before clamping activates.
- **Legacy Browser Compatibility**: Solves overflow issues on older browsers that don't support the -webkit-line-clamp property, ensuring consistent behavior across different platforms.

## Installation

Install the package using npm:

```bash
npm install @chitova/ngx-clamp
```

## Usage

```ts
import { NgxClamp } from '@chitova/ngx-clamp';

@Component({
    selector: 'my-component',
    template: `
        <div ngxClamp [maxHeight]="100" truncationText="...">
            Your long text goes here, and it will be clamped if it exceeds the specified height.
            <p>Your long text goes here in nested element</p>
        </div>
        <div ngxClamp [maxHeight]="150" truncationText="Read more...">
            This is a longer paragraph that will be clamped to fit within the specified height.
        </div>
    `,
    imports: [NgxClamp],
})
export class MyComponent {}
```

## License

@chitova/ngx-clamp is released under the MIT License.
