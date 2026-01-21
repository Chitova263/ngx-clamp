import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

const WORD_SEPARATOR = ' ';
const DEFAULT_LINE_HEIGHT_MULTIPLIER = 1.187;

@Directive({
    selector: '[ngxClamp]',
    standalone: true,
})
export class NgxClamp implements AfterViewInit, OnChanges {
    @Input() maxHeight: number | null = null;
    @Input() lines: number = 0;
    @Input() truncationCharacters: string = '...';

    maxLines: number = 0;

    private cachedLineHeight: number | null = null;
    private originalContent: string | null = null;
    private isInitialized: boolean = false;
    private readonly element: HTMLElement;

    constructor(elementRef: ElementRef<HTMLElement>) {
        this.element = elementRef.nativeElement;
    }

    ngAfterViewInit(): void {
        this.originalContent = this.element.innerHTML;
        this.isInitialized = true;
        this.clamp();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const shouldReclamp = changes['maxHeight'] || changes['lines'];
        if (shouldReclamp && this.isInitialized) {
            this.cachedLineHeight = null;
            this.restoreOriginalContent();
            this.clamp();
        }
    }

    private restoreOriginalContent(): void {
        if (this.originalContent !== null) {
            this.element.innerHTML = this.originalContent;
        }
    }

    private clamp(): void {
        const hasConstraints = this.maxHeight || this.lines;
        if (!hasConstraints) {
            return;
        }

        this.maxLines = this.lines || this.calculateMaxLines();

        const maxAllowedHeight = Math.max(
            this.maxHeight ?? 0,
            this.getLineHeight() * this.maxLines
        );

        const needsTruncation = this.element.clientHeight > maxAllowedHeight;
        if (needsTruncation) {
            const textNode = this.findDeepestTextNode(this.element);
            if (textNode) {
                this.truncateNode(textNode, maxAllowedHeight);
            }
        }
    }

    /**
     * Uses binary search to find the optimal number of words that fit within maxHeight.
     * Falls back to previous text node if current node's first word doesn't fit.
     */
    private truncateNode(node: ChildNode, maxHeight: number): void {
        const text = node.nodeValue;
        if (!text) {
            return;
        }

        const words = text.split(WORD_SEPARATOR);

        // Early exit: text already fits
        if (this.textFits(node, text + this.truncationCharacters, maxHeight)) {
            node.nodeValue = text;
            return;
        }

        // First word doesn't fit: move to previous node
        if (!this.textFits(node, words[0] + this.truncationCharacters, maxHeight)) {
            node.nodeValue = this.truncationCharacters;
            const previousNode = this.findDeepestTextNode(this.element);
            if (previousNode) {
                this.truncateNode(previousNode, maxHeight);
            }
            return;
        }

        // Binary search for optimal word count
        const optimalWordCount = this.findOptimalWordCount(node, words, maxHeight);
        node.nodeValue = words.slice(0, optimalWordCount).join(WORD_SEPARATOR) + this.truncationCharacters;
    }

    private textFits(node: ChildNode, text: string, maxHeight: number): boolean {
        node.nodeValue = text;
        return this.element.clientHeight <= maxHeight;
    }

    private findOptimalWordCount(node: ChildNode, words: string[], maxHeight: number): number {
        let low = 1;
        let high = words.length;
        let result = 1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const testText = words.slice(0, mid).join(WORD_SEPARATOR) + this.truncationCharacters;

            if (this.textFits(node, testText, maxHeight)) {
                result = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return result;
    }

    private getLineHeight(): number {
        if (this.cachedLineHeight !== null) {
            return this.cachedLineHeight;
        }

        const styles = getComputedStyle(this.element);

        if (styles.lineHeight === 'normal') {
            const fontSize = parseFloat(styles.fontSize);
            this.cachedLineHeight = Math.ceil(fontSize * DEFAULT_LINE_HEIGHT_MULTIPLIER);
        } else {
            this.cachedLineHeight = Math.ceil(parseFloat(styles.lineHeight));
        }

        return this.cachedLineHeight;
    }

    private calculateMaxLines(): number {
        const availableHeight = this.maxHeight ?? this.element.clientHeight;
        return Math.max(Math.floor(availableHeight / this.getLineHeight()), 0);
    }

    /**
     * Recursively finds the deepest text node, skipping empty nodes.
     */
    private findDeepestTextNode(node: ChildNode): ChildNode | null {
        if (!node.lastChild) {
            return node;
        }

        // Traverse to nested children
        if (node.lastChild.childNodes?.length > 0) {
            const lastChildIndex = node.childNodes.length - 1;
            return this.findDeepestTextNode(node.childNodes.item(lastChildIndex)!);
        }

        // Skip empty or truncation-only nodes
        const isEmptyNode = !node.lastChild.nodeValue
            || node.lastChild.nodeValue === ''
            || node.lastChild.nodeValue === this.truncationCharacters;

        if (isEmptyNode && node.lastChild.parentNode) {
            node.lastChild.parentNode.removeChild(node.lastChild);
            return this.findDeepestTextNode(this.element);
        }

        return node.lastChild;
    }
}
