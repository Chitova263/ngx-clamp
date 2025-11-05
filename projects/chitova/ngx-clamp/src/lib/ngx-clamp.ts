import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[ngxClamp]'
})
export class NgxClamp implements AfterViewInit, OnChanges {
  @Input({ required: true })
  public maxHeight: number = 0;

  @Input()
  public truncationCharacters: string = '...';

  public maxLines: number = 0;

  private readonly splitOnWordsCharacter: string = ' ';

  constructor(private readonly htmlElementRef: ElementRef<HTMLElement>) {}

  public ngAfterViewInit(): void {
    this.clamp();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['height']) {
      this.clamp();
    }
  }

  private clamp(): void {
    this.maxLines = this.getMaxLines();
    const hostHtmlElement: HTMLElement = this.htmlElementRef.nativeElement;
    const maxRequiredHeight: number = Math.max(this.maxHeight, this.getMaxHeight(this.maxLines, hostHtmlElement));
    if (maxRequiredHeight < hostHtmlElement.clientHeight) {
      const lastChild: ChildNode = this.getLastChild(hostHtmlElement);
      if (lastChild) {
        this.truncate(maxRequiredHeight, lastChild);
      }
    }
  }

  // Recursively removes words from the text until its width or height is beneath maximum required height.
  private truncate(
    maxRequiredHeight: number,
    node: ChildNode,
    words: string[] | undefined = undefined,
    isCurrentNodeValueSplitIntoWords: boolean = false
  ): void {
    // Removes truncation characters from node text
    const nodeValue: string | undefined = node.nodeValue?.replace(this.truncationCharacters, '');

    if (!words && nodeValue) {
      words = nodeValue.split(this.splitOnWordsCharacter);
      isCurrentNodeValueSplitIntoWords = true;
    }

    if (words) {
      const isTexFits: boolean = this.htmlElementRef.nativeElement.clientHeight <= maxRequiredHeight;
      node.nodeValue = words.join(this.splitOnWordsCharacter) + this.truncationCharacters;
      if (isTexFits) {
        return;
      }
    }

    // If there are words left to remove, remove the last one and see if the nodeValue fits.
    if (words && words.length > 1) {
      words.pop();
      node.nodeValue = words.join(this.splitOnWordsCharacter) + this.truncationCharacters;
    }
    // No more words can be removed using this character
    else {
      words = undefined;
    }

    if (words) {
      const isTexFits: boolean = this.htmlElementRef.nativeElement.clientHeight <= maxRequiredHeight;
      if (isTexFits) {
        return;
      }
    }

    // No valid words produced
    else if (isCurrentNodeValueSplitIntoWords) {
      // No valid words even when splitting by letter, time to move on to the next node

      // Set the current node value to the truncation character
      node.nodeValue = this.truncationCharacters;
      node = this.getLastChild(this.htmlElementRef.nativeElement);
      return this.truncate(maxRequiredHeight, node);
    }
    return this.truncate(maxRequiredHeight, node, words, isCurrentNodeValueSplitIntoWords);
  }

  private getMaxHeight(maxLines: number, element: HTMLElement): number {
    const lineHeight: number = this.getLineHeight(element);
    return lineHeight * maxLines;
  }

  private getLineHeight(element: HTMLElement): number {
    const cssStyleDeclaration: CSSStyleDeclaration = getComputedStyle(element, 'line-height');
    const lineHeight: string = cssStyleDeclaration.lineHeight;
    if (cssStyleDeclaration.lineHeight === 'normal') {
      // Normal line heights vary from browser to browser. The spec recommends a value between 1.0 and 1.2 of the font size.
      return Math.ceil(parseInt(getComputedStyle(element, 'font-size').fontSize, 10) * 1.187);
    }
    return Math.ceil(parseInt(lineHeight, 10));
  }

  private getMaxLines(): number {
    // Returns the maximum number of lines of text that should be rendered based on the current height of the element and the line-height of the text.
    const hostHtmlElement: HTMLElement = this.htmlElementRef.nativeElement;
    const availableHeight: number = this.maxHeight ?? hostHtmlElement.clientHeight;
    return Math.max(Math.floor(availableHeight / this.getLineHeight(hostHtmlElement)), 0);
  }

  private getLastChild(node: ChildNode): ChildNode {
    // Gets an element's last child. That may be another node or a node's contents.
    if (!node.lastChild) {
      return node;
    }
    // Current element has children, need to go deeper and get last child as a text node
    if (node.lastChild.childNodes && node.lastChild.childNodes.length > 0) {
      return this.getLastChild(node.childNodes.item(node.childNodes.length - 1));
    }
    // This is the absolute last child, a text node, but something's wrong with it. Remove it and keep trying
    else if (
      node.lastChild.parentNode &&
      (!node.lastChild?.nodeValue || node.lastChild.nodeValue === '' || node.lastChild.nodeValue === this.truncationCharacters)
    ) {
      node.lastChild.parentNode.removeChild(node.lastChild);
      return this.getLastChild(this.htmlElementRef.nativeElement);
    }
    // This is the last child we want, return it
    else {
      return node.lastChild;
    }
  }
}
