import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxClamp } from '@chitovas/ngx-clamp';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [NgxClamp, FormsModule],
    template: `
        <div class="container">
            <header>
                <h1>ngx-clamp</h1>
                <p class="subtitle">A lightweight Angular directive for clamping text</p>
            </header>

            <main>
                <!-- Controls -->
                <section class="controls">
                    <h2>Configuration</h2>
                    <div class="control-grid">
                        <div class="control-group">
                            <label for="lines">Lines</label>
                            <input
                                type="number"
                                id="lines"
                                [(ngModel)]="lines"
                                min="0"
                                max="20"
                            />
                        </div>
                        <div class="control-group">
                            <label for="maxHeight">Max Height (px)</label>
                            <input
                                type="number"
                                id="maxHeight"
                                [(ngModel)]="maxHeight"
                                min="0"
                                max="500"
                            />
                        </div>
                        <div class="control-group">
                            <label for="truncationText">Truncation Text</label>
                            <input
                                type="text"
                                id="truncationText"
                                [(ngModel)]="truncationText"
                            />
                        </div>
                    </div>
                    <p class="hint">Set lines to 0 to use maxHeight instead</p>
                </section>

                <!-- Demo Cards -->
                <section class="demos">
                    <h2>Examples</h2>

                    <!-- Basic Example -->
                    <div class="demo-card">
                        <h3>Clamp by Lines</h3>
                        <div class="demo-content">
                            <div
                                class="clamp-box"
                                ngxClamp
                                [lines]="lines || 3"
                                [truncationText]="truncationText"
                                (clamped)="onClamped('lines', $event)"
                            >
                                {{ sampleText }}
                            </div>
                        </div>
                        <div class="demo-status">
                            <span class="badge" [class.truncated]="clampStatus['lines']">
                                {{ clampStatus['lines'] ? 'Truncated' : 'Full content' }}
                            </span>
                        </div>
                    </div>

                    <!-- Max Height Example -->
                    <div class="demo-card">
                        <h3>Clamp by Max Height</h3>
                        <div class="demo-content">
                            <div
                                class="clamp-box"
                                ngxClamp
                                [maxHeight]="maxHeight || 80"
                                [truncationText]="truncationText"
                                (clamped)="onClamped('maxHeight', $event)"
                            >
                                {{ sampleText }}
                            </div>
                        </div>
                        <div class="demo-status">
                            <span class="badge" [class.truncated]="clampStatus['maxHeight']">
                                {{ clampStatus['maxHeight'] ? 'Truncated' : 'Full content' }}
                            </span>
                        </div>
                    </div>

                    <!-- Nested HTML Example -->
                    <div class="demo-card">
                        <h3>Nested HTML Content</h3>
                        <div class="demo-content">
                            <div
                                class="clamp-box"
                                ngxClamp
                                [lines]="lines || 3"
                                [truncationText]="truncationText"
                                (clamped)="onClamped('nested', $event)"
                            >
                                <strong>Important:</strong> This example shows how ngx-clamp
                                handles <em>nested HTML elements</em> like bold, italic, and
                                <span style="color: #0066cc">colored text</span>. The directive
                                intelligently traverses the DOM tree to find text nodes and
                                truncates them appropriately while preserving the HTML structure.
                            </div>
                        </div>
                        <div class="demo-status">
                            <span class="badge" [class.truncated]="clampStatus['nested']">
                                {{ clampStatus['nested'] ? 'Truncated' : 'Full content' }}
                            </span>
                        </div>
                    </div>

                    <!-- Article Card Example -->
                    <div class="demo-card">
                        <h3>Article Preview Card</h3>
                        <div class="article-card">
                            <img
                                src="https://picsum.photos/400/200"
                                alt="Article thumbnail"
                                class="article-image"
                            />
                            <div class="article-body">
                                <h4>Understanding Angular Directives</h4>
                                <p
                                    class="article-excerpt"
                                    ngxClamp
                                    [lines]="2"
                                    truncationText=" [Read more]"
                                    (clamped)="onClamped('article', $event)"
                                >
                                    Angular directives are powerful tools that allow you to extend
                                    HTML with custom behaviors. They can transform the DOM, add
                                    event listeners, and create reusable components. In this
                                    article, we explore the different types of directives and how
                                    to create your own.
                                </p>
                                <div class="article-meta">
                                    <span>5 min read</span>
                                    <span>Angular</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Usage Code -->
                <section class="usage">
                    <h2>Usage</h2>
                    <pre><code>import {{ '{' }} NgxClamp {{ '}' }} from '&#64;chitovas/ngx-clamp';

&#64;Component({{ '{' }}
    imports: [NgxClamp],
    template: \`
        &lt;p ngxClamp [lines]="3"&gt;Long text...&lt;/p&gt;
        &lt;p ngxClamp [maxHeight]="100"&gt;Long text...&lt;/p&gt;
        &lt;p ngxClamp [lines]="2" truncationText=" Read more..."&gt;Long text...&lt;/p&gt;
        &lt;p ngxClamp [lines]="3" (clamped)="onClamped($event)"&gt;Long text...&lt;/p&gt;
    \`
{{ '}' }})</code></pre>
                </section>
            </main>

            <footer>
                <p>
                    <a href="https://github.com/Chitova263/ngx-clamp" target="_blank">GitHub</a>
                    &middot;
                    <a href="https://www.npmjs.com/package/@chitovas/ngx-clamp" target="_blank">npm</a>
                </p>
            </footer>
        </div>
    `,
    styles: [`
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
        }

        header {
            text-align: center;
            margin-bottom: 3rem;
        }

        header h1 {
            font-size: 2.5rem;
            font-weight: 600;
            color: #1a1a1a;
        }

        .subtitle {
            color: #666;
            font-size: 1.1rem;
            margin-top: 0.5rem;
        }

        section {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        section h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1a1a1a;
        }

        .controls {
            background: #fafafa;
        }

        .control-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
        }

        .control-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .control-group label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #555;
        }

        .control-group input {
            padding: 0.5rem 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s;
        }

        .control-group input:focus {
            outline: none;
            border-color: #0066cc;
        }

        .hint {
            font-size: 0.8rem;
            color: #888;
            margin-top: 1rem;
        }

        .demo-card {
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .demo-card:last-child {
            margin-bottom: 0;
        }

        .demo-card h3 {
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 0.75rem;
            color: #333;
        }

        .clamp-box {
            background: #f9f9f9;
            padding: 1rem;
            border-radius: 6px;
            line-height: 1.6;
        }

        .demo-status {
            margin-top: 0.75rem;
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 500;
            background: #e8f5e9;
            color: #2e7d32;
        }

        .badge.truncated {
            background: #fff3e0;
            color: #e65100;
        }

        .article-card {
            border: 1px solid #eee;
            border-radius: 8px;
            overflow: hidden;
        }

        .article-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
        }

        .article-body {
            padding: 1rem;
        }

        .article-body h4 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }

        .article-excerpt {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
        }

        .article-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.8rem;
            color: #888;
        }

        .usage pre {
            background: #1a1a1a;
            color: #f5f5f5;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 0.875rem;
            line-height: 1.5;
        }

        footer {
            text-align: center;
            padding: 2rem;
            color: #666;
        }

        footer a {
            color: #0066cc;
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }
    `],
})
export class AppComponent {
    lines: number = 3;
    maxHeight: number = 80;
    truncationText: string = '...';

    clampStatus: Record<string, boolean> = {};

    sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

    onClamped(key: string, clamped: boolean): void {
        this.clampStatus[key] = clamped;
    }
}
