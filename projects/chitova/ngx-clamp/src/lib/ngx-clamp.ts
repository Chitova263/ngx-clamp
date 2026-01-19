import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';

/**
 * A directive that clamps text content to a specified number of lines or maximum height.
 * Supports cross-browser text truncation with customizable truncation indicators.
 *
 * @example
 * ```html
 * <p ngxClamp [lines]="3">Long text content...</p>
 * <p ngxClamp [maxHeight]="100">Long text content...</p>
 * <p ngxClamp [lines]="2" truncationText=" Read more...">Long text content...</p>
 * ```
 */
@Directive({
    selector: '[ngxClamp]',
    standalone: true,
})
export class NgxClamp implements AfterViewInit, OnChanges {
    /**
     * Maximum height in pixels before clamping. Use either `maxHeight` or `lines`, not both.
     * If both are provided, `lines` takes precedence.
     */
    @Input()
    public maxHeight: number | null = null;

    /**
     * Number of lines to display before clamping. Use either `lines` or `maxHeight`, not both.
     * If both are provided, `lines` takes precedence.
     */
    @Input()
    public lines: number = 0;

    /**
     * Text to append when content is truncated.
     * @default '...'
     */
    @Input()
    public truncationText: string = '...';

    /**
     * Emits `true` when content was truncated, `false` when content fits without truncation.
     */
    @Output()
    public clamped = new EventEmitter<boolean>();

    private readonly splitOnWordsCharacter: string = ' ';
    private maxLines: number = 0;

    constructor(private readonly htmlElementRef: ElementRef<HTMLElement>) {}

    public ngAfterViewInit(): void {
        this.clamp();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['maxHeight'] || changes['lines']) {
            this.clamp();
        }
    }

    private clamp(): void {
        if (!this.validateInputs()) {
            return;
        }

        const hostElement = this.htmlElementRef.nativeElement;
        this.maxLines = this.lines > 0 ? this.lines : this.getMaxLines();
        const maxRequiredHeight = this.calculateMaxHeight(this.maxLines, hostElement);
        const currentHeight = hostElement.clientHeight;

        if (maxRequiredHeight < currentHeight) {
            const lastChild = this.getLastChild(hostElement);
            if (lastChild) {
                this.truncate(maxRequiredHeight, lastChild);
                this.clamped.emit(true);
            }
        } else {
            this.clamped.emit(false);
        }
    }

    /**
     * Validates inputs and returns whether clamping should proceed.
     */
    private validateInputs(): boolean {
        if (!this.maxHeight && !this.lines) {
            return false;
        }

        if (this.lines < 0) {
            console.warn('ngxClamp: lines must be a positive number. Received:', this.lines);
            return false;
        }

        if (this.maxHeight !== null && this.maxHeight < 0) {
            console.warn('ngxClamp: maxHeight must be a positive number. Received:', this.maxHeight);
            return false;
        }

        return true;
    }

    /**
     * Recursively removes words from the text until content fits within the maximum required height.
     */
    private truncate(
        maxRequiredHeight: number,
        node: ChildNode,
        words: string[] | undefined = undefined,
        isCurrentNodeValueSplitIntoWords: boolean = false
    ): void {
        const nodeValue = node.nodeValue?.replace(this.truncationText, '');

        if (!words && nodeValue) {
            words = nodeValue.split(this.splitOnWordsCharacter);
            isCurrentNodeValueSplitIntoWords = true;
        }

        if (words) {
            node.nodeValue = words.join(this.splitOnWordsCharacter) + this.truncationText;
            const isTextFits = this.htmlElementRef.nativeElement.clientHeight <= maxRequiredHeight;
            if (isTextFits) {
                return;
            }
        }

        // If there are words left to remove, remove the last one and check if content fits
        if (words && words.length > 1) {
            words.pop();
            node.nodeValue = words.join(this.splitOnWordsCharacter) + this.truncationText;

            const isTextFits = this.htmlElementRef.nativeElement.clientHeight <= maxRequiredHeight;
            if (isTextFits) {
                return;
            }
        } else {
            words = undefined;
        }

        // No valid words produced - move to the previous text node
        if (!words && isCurrentNodeValueSplitIntoWords) {
            node.nodeValue = this.truncationText;
            const newLastChild = this.getLastChild(this.htmlElementRef.nativeElement);
            if (newLastChild) {
                return this.truncate(maxRequiredHeight, newLastChild);
            }
            return;
        }

        return this.truncate(maxRequiredHeight, node, words, isCurrentNodeValueSplitIntoWords);
    }

    /**
     * Calculates the maximum allowed height based on line count.
     * If `lines` is set, it takes precedence over `maxHeight`.
     */
    private calculateMaxHeight(maxLines: number, element: HTMLElement): number {
        // lines takes precedence over maxHeight
        if (this.lines > 0) {
            return this.getLineHeight(element) * maxLines;
        }
        return this.maxHeight ?? 0;
    }

    private getLineHeight(element: HTMLElement): number {
        const computedStyle = getComputedStyle(element);
        const lineHeight = computedStyle.lineHeight;

        if (lineHeight === 'normal') {
            // Normal line heights vary from browser to browser.
            // The spec recommends a value between 1.0 and 1.2 of the font size.
            const fontSize = parseInt(computedStyle.fontSize, 10);
            return Math.ceil(fontSize * 1.2);
        }

        return Math.ceil(parseInt(lineHeight, 10));
    }

    /**
     * Returns the maximum number of lines based on maxHeight and line-height.
     */
    private getMaxLines(): number {
        const hostElement = this.htmlElementRef.nativeElement;
        const availableHeight = this.maxHeight ?? hostElement.clientHeight;
        const lineHeight = this.getLineHeight(hostElement);
        return Math.max(Math.floor(availableHeight / lineHeight), 0);
    }

    /**
     * Recursively finds the last text node in the element tree.
     * Removes empty or truncation-only nodes along the way.
     */
    private getLastChild(node: ChildNode): ChildNode | null {
        if (!node.lastChild) {
            return node;
        }

        // Current element has children, need to go deeper to get the last text node
        if (node.lastChild.childNodes && node.lastChild.childNodes.length > 0) {
            return this.getLastChild(node.lastChild);
        }

        // This is the absolute last child, but it's empty or only contains truncation text - remove it
        const lastChildValue = node.lastChild.nodeValue;
        if (
            node.lastChild.parentNode &&
            (!lastChildValue || lastChildValue === '' || lastChildValue === this.truncationText)
        ) {
            node.lastChild.parentNode.removeChild(node.lastChild);
            return this.getLastChild(this.htmlElementRef.nativeElement);
        }

        // This is the last valid text node
        return node.lastChild;
    }
}