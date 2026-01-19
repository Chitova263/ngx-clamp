import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
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
export class NgxClamp implements AfterViewInit, OnChanges, OnDestroy {
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
    private cachedLineHeight: number | null = null;
    private originalContent: string | null = null;

    constructor(private readonly htmlElementRef: ElementRef<HTMLElement>) {}

    public ngAfterViewInit(): void {
        this.storeOriginalContent();
        this.clamp();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['maxHeight'] || changes['lines']) {
            this.invalidateCache();
            this.restoreOriginalContent();
            this.clamp();
        }
    }

    public ngOnDestroy(): void {
        this.invalidateCache();
    }

    /**
     * Stores original content for restoration on input changes.
     */
    private storeOriginalContent(): void {
        this.originalContent = this.htmlElementRef.nativeElement.innerHTML;
    }

    /**
     * Restores original content before re-clamping.
     */
    private restoreOriginalContent(): void {
        if (this.originalContent !== null) {
            this.htmlElementRef.nativeElement.innerHTML = this.originalContent;
        }
    }

    /**
     * Invalidates cached values.
     */
    private invalidateCache(): void {
        this.cachedLineHeight = null;
    }

    private clamp(): void {
        if (!this.validateInputs()) {
            return;
        }

        const hostElement = this.htmlElementRef.nativeElement;
        const maxLines = this.lines > 0 ? this.lines : this.getMaxLines();
        const maxRequiredHeight = this.calculateMaxHeight(maxLines, hostElement);
        const currentHeight = hostElement.clientHeight;

        if (maxRequiredHeight < currentHeight) {
            const lastChild = this.getLastTextNode(hostElement);
            if (lastChild) {
                this.truncateWithBinarySearch(maxRequiredHeight, lastChild);
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
     * Uses binary search to find the optimal number of words that fit within the max height.
     * This is O(log n) compared to the previous O(n) linear approach.
     */
    private truncateWithBinarySearch(maxRequiredHeight: number, node: ChildNode): void {
        const hostElement = this.htmlElementRef.nativeElement;

        // Iteratively process text nodes until content fits
        while (hostElement.clientHeight > maxRequiredHeight) {
            const nodeValue = node.nodeValue?.replace(this.truncationText, '');
            if (!nodeValue) {
                // Move to previous text node
                node.nodeValue = this.truncationText;
                const prevNode = this.getLastTextNode(hostElement);
                if (!prevNode || prevNode === node) {
                    return;
                }
                node = prevNode;
                continue;
            }

            const words = nodeValue.split(this.splitOnWordsCharacter);

            if (words.length <= 1) {
                // Single word or empty - move to previous node
                node.nodeValue = this.truncationText;
                const prevNode = this.getLastTextNode(hostElement);
                if (!prevNode || prevNode === node) {
                    return;
                }
                node = prevNode;
                continue;
            }

            // Binary search for optimal word count
            let low = 0;
            let high = words.length;
            let optimalCount = 0;

            while (low < high) {
                const mid = Math.floor((low + high + 1) / 2);
                node.nodeValue = words.slice(0, mid).join(this.splitOnWordsCharacter) + this.truncationText;

                if (hostElement.clientHeight <= maxRequiredHeight) {
                    optimalCount = mid;
                    low = mid;
                } else {
                    high = mid - 1;
                }
            }

            if (optimalCount > 0) {
                node.nodeValue = words.slice(0, optimalCount).join(this.splitOnWordsCharacter) + this.truncationText;
                return;
            }

            // No words fit - move to previous node
            node.nodeValue = this.truncationText;
            const prevNode = this.getLastTextNode(hostElement);
            if (!prevNode || prevNode === node) {
                return;
            }
            node = prevNode;
        }
    }

    /**
     * Calculates the maximum allowed height based on line count.
     * If `lines` is set, it takes precedence over `maxHeight`.
     */
    private calculateMaxHeight(maxLines: number, element: HTMLElement): number {
        if (this.lines > 0) {
            return this.getLineHeight(element) * maxLines;
        }
        return this.maxHeight ?? 0;
    }

    /**
     * Gets line height with caching to avoid repeated getComputedStyle calls.
     */
    private getLineHeight(element: HTMLElement): number {
        if (this.cachedLineHeight !== null) {
            return this.cachedLineHeight;
        }

        const computedStyle = getComputedStyle(element);
        const lineHeight = computedStyle.lineHeight;

        if (lineHeight === 'normal') {
            const fontSize = parseInt(computedStyle.fontSize, 10);
            this.cachedLineHeight = Math.ceil(fontSize * 1.2);
        } else {
            this.cachedLineHeight = Math.ceil(parseInt(lineHeight, 10));
        }

        return this.cachedLineHeight;
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
     * Iteratively finds the last text node in the element tree.
     * Removes empty or truncation-only nodes along the way.
     */
    private getLastTextNode(node: ChildNode): ChildNode | null {
        let current: ChildNode | null = node;

        while (current) {
            // If no children, this is the node we want
            if (!current.lastChild) {
                return current;
            }

            // Go to last child
            let lastChild: ChildNode | null = current.lastChild;

            // If last child has children, go deeper
            if (lastChild.childNodes && lastChild.childNodes.length > 0) {
                current = lastChild;
                continue;
            }

            // Check if last child is empty or only contains truncation text
            const lastChildValue = lastChild.nodeValue;
            if (!lastChildValue || lastChildValue === '' || lastChildValue === this.truncationText) {
                // Remove empty node and try again
                if (lastChild.parentNode) {
                    lastChild.parentNode.removeChild(lastChild);
                }
                current = this.htmlElementRef.nativeElement;
                continue;
            }

            // Found valid text node
            return lastChild;
        }

        return null;
    }
}
