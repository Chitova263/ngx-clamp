import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxClamp } from './ngx-clamp';

@Component({
    standalone: true,
    imports: [NgxClamp],
    template: `<div ngxClamp [lines]="lines" [maxHeight]="maxHeight" [truncationText]="truncationText" (clamped)="onClamped($event)"
        style="width: 200px; font-size: 16px; line-height: 20px;">{{ content }}</div>`,
})
class TestHostComponent {
    lines: number = 0;
    maxHeight: number | null = null;
    truncationText: string = '...';
    content: string = '';
    wasClamped: boolean | null = null;

    onClamped(clamped: boolean): void {
        this.wasClamped = clamped;
    }
}

@Component({
    standalone: true,
    imports: [NgxClamp],
    template: `<div ngxClamp [lines]="3" style="width: 200px; font-size: 16px; line-height: 20px;">
        <p>First paragraph</p>
        <p>Second paragraph with more content</p>
        <p>Third paragraph</p>
    </div>`,
})
class NestedContentTestComponent {}

describe('NgxClamp', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let directiveElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        directiveElement = fixture.debugElement.query(By.directive(NgxClamp));
    });

    describe('initialization', () => {
        it('should create the directive', () => {
            fixture.detectChanges();
            expect(directiveElement).toBeTruthy();
        });

        it('should not clamp when no lines or maxHeight is set', () => {
            component.content = 'Short text';
            fixture.detectChanges();
            expect(component.wasClamped).toBeNull();
        });

        it('should emit false when content fits within constraints', () => {
            component.lines = 5;
            component.content = 'Short text';
            fixture.detectChanges();
            expect(component.wasClamped).toBe(false);
        });
    });

    describe('clamping by lines', () => {
        it('should clamp text exceeding line count', () => {
            component.lines = 2;
            component.content = 'This is a very long text that should definitely exceed two lines when rendered in a container that is only 200 pixels wide with a 16px font size';
            fixture.detectChanges();

            expect(component.wasClamped).toBe(true);
            expect(directiveElement.nativeElement.textContent).toContain('...');
        });

        it('should not clamp text within line count', () => {
            component.lines = 10;
            component.content = 'Short text';
            fixture.detectChanges();

            expect(component.wasClamped).toBe(false);
        });

        it('should use custom truncation text', () => {
            component.lines = 1;
            component.truncationText = ' [Read more]';
            component.content = 'This is a very long text that should be clamped to one line only';
            fixture.detectChanges();

            expect(directiveElement.nativeElement.textContent).toContain('[Read more]');
        });
    });

    describe('clamping by maxHeight', () => {
        it('should clamp text exceeding maxHeight', () => {
            component.maxHeight = 40; // 2 lines at 20px line-height
            component.content = 'This is a very long text that should definitely exceed 40 pixels in height when rendered in a container that is only 200 pixels wide';
            fixture.detectChanges();

            expect(component.wasClamped).toBe(true);
        });

        it('should not clamp text within maxHeight', () => {
            component.maxHeight = 200;
            component.content = 'Short text';
            fixture.detectChanges();

            expect(component.wasClamped).toBe(false);
        });
    });

    describe('input validation', () => {
        it('should warn and not clamp with negative lines', () => {
            const warnSpy = spyOn(console, 'warn');
            component.lines = -1;
            component.content = 'Some text';
            fixture.detectChanges();

            expect(warnSpy).toHaveBeenCalledWith('ngxClamp: lines must be a positive number. Received:', -1);
        });

        it('should warn and not clamp with negative maxHeight', () => {
            const warnSpy = spyOn(console, 'warn');
            component.maxHeight = -100;
            component.content = 'Some text';
            fixture.detectChanges();

            expect(warnSpy).toHaveBeenCalledWith('ngxClamp: maxHeight must be a positive number. Received:', -100);
        });
    });

    describe('input changes', () => {
        it('should re-clamp when lines input changes', fakeAsync(() => {
            component.lines = 10;
            component.content = 'This is a long text that spans multiple lines when rendered in the test container';
            fixture.detectChanges();
            tick();

            expect(component.wasClamped).toBe(false);

            component.lines = 1;
            fixture.detectChanges();
            tick();

            expect(component.wasClamped).toBe(true);
        }));

        it('should re-clamp when maxHeight input changes', fakeAsync(() => {
            component.maxHeight = 500;
            component.content = 'This is a long text that spans multiple lines when rendered in the test container';
            fixture.detectChanges();
            tick();

            expect(component.wasClamped).toBe(false);

            component.maxHeight = 20;
            fixture.detectChanges();
            tick();

            expect(component.wasClamped).toBe(true);
        }));
    });

    describe('precedence', () => {
        it('should use lines over maxHeight when both are set', () => {
            component.lines = 1;
            component.maxHeight = 500; // This would allow many lines
            component.content = 'This is a very long text that should be clamped to one line because lines takes precedence over maxHeight';
            fixture.detectChanges();

            expect(component.wasClamped).toBe(true);
            // Content should be clamped to 1 line worth, not 500px worth
        });
    });

    describe('nested content', () => {
        it('should handle nested HTML elements', async () => {
            const nestedFixture = TestBed.createComponent(NestedContentTestComponent);
            nestedFixture.detectChanges();

            const element = nestedFixture.debugElement.query(By.directive(NgxClamp));
            expect(element).toBeTruthy();
        });
    });

    describe('edge cases', () => {
        it('should handle empty content', () => {
            component.lines = 3;
            component.content = '';
            fixture.detectChanges();

            expect(component.wasClamped).toBe(false);
        });

        it('should handle single word content', () => {
            component.lines = 1;
            component.content = 'Supercalifragilisticexpialidocious';
            fixture.detectChanges();

            // Should not throw an error
            expect(directiveElement).toBeTruthy();
        });

        it('should handle whitespace-only content', () => {
            component.lines = 1;
            component.content = '   ';
            fixture.detectChanges();

            expect(component.wasClamped).toBe(false);
        });
    });
});
