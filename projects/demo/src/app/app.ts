import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgxClamp } from '@chitova/ngx-clamp';

@Component({
    selector: 'app-root',
    imports: [NgxClamp],
    templateUrl: './app.html',
    styleUrl: './app.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
    lineCount = signal(3);
    expandedCards = signal<Set<number>>(new Set());

    articles = [
        {
            id: 1,
            title: 'Getting Started with Angular Signals',
            author: 'Sarah Chen',
            date: 'Jan 15, 2024',
            image: 'https://picsum.photos/seed/angular/400/200',
            content: `Angular Signals represent a paradigm shift in how we handle reactivity in Angular applications. Unlike traditional change detection, signals provide fine-grained reactivity that only updates what actually changed. This leads to better performance and more predictable state management. In this comprehensive guide, we'll explore how to migrate your existing applications to use signals effectively.`,
        },
        {
            id: 2,
            title: 'Building Scalable Design Systems',
            author: 'Marcus Johnson',
            date: 'Jan 12, 2024',
            image: 'https://picsum.photos/seed/design/400/200',
            content: `A well-crafted design system is the backbone of consistent user experiences across products. It encompasses not just UI components, but also design tokens, accessibility guidelines, and documentation. Learn how leading companies structure their design systems to scale across multiple teams and products while maintaining brand consistency and developer productivity.`,
        },
        {
            id: 3,
            title: 'The Future of Web Performance',
            author: 'Emily Rodriguez',
            date: 'Jan 10, 2024',
            image: 'https://picsum.photos/seed/perf/400/200',
            content: `Core Web Vitals have changed how we think about performance. With metrics like LCP, FID, and CLS becoming ranking factors, optimizing for user experience is more important than ever. Discover advanced techniques for lazy loading, code splitting, and resource prioritization that will keep your applications fast and responsive.`,
        },
    ];

    products = [
        {
            name: 'Wireless Noise-Canceling Headphones',
            price: 299.99,
            rating: 4.8,
            image: 'https://picsum.photos/seed/headphones/300/300',
            description: `Experience premium audio with our flagship wireless headphones featuring advanced noise-canceling technology. With 30-hour battery life, premium memory foam cushions, and Hi-Res audio certification, these headphones deliver studio-quality sound wherever you go. Perfect for commuting, working, or relaxing at home.`,
        },
        {
            name: 'Smart Fitness Watch Pro',
            price: 449.99,
            rating: 4.6,
            image: 'https://picsum.photos/seed/watch/300/300',
            description: `Track your health and fitness with precision. Features include ECG monitoring, blood oxygen sensing, sleep tracking, and GPS. Water-resistant to 50 meters with a stunning AMOLED display. Syncs seamlessly with your phone for notifications, music control, and contactless payments.`,
        },
        {
            name: 'Portable Power Station',
            price: 599.99,
            rating: 4.9,
            image: 'https://picsum.photos/seed/power/300/300',
            description: `Power anything, anywhere. This 1000Wh portable power station features multiple AC outlets, USB-C PD ports, and wireless charging. Perfect for camping, emergencies, or working remotely. Charges via solar panels, car charger, or wall outlet. Built-in MPPT controller for efficient solar charging.`,
        },
    ];

    testimonials = [
        {
            name: 'Alex Thompson',
            role: 'Frontend Developer at TechCorp',
            avatar: 'https://i.pravatar.cc/100?img=1',
            quote: `ngx-clamp solved our text overflow issues across the entire application. The API is intuitive, and it works flawlessly with dynamic content. We've used it on our blog cards, product descriptions, and comment sections. Highly recommended for any Angular project dealing with user-generated content.`,
        },
        {
            name: 'Jessica Martinez',
            role: 'UI/UX Lead at DesignStudio',
            avatar: 'https://i.pravatar.cc/100?img=5',
            quote: `Finally, a clamping solution that respects our design system! The custom truncation text feature lets us maintain brand voice even when content is truncated. It's lightweight, performant, and the cross-browser support saved us countless hours of testing and debugging edge cases.`,
        },
    ];

    isExpanded(id: number): boolean {
        return this.expandedCards().has(id);
    }

    toggleCard(id: number): void {
        const current = new Set(this.expandedCards());
        if (current.has(id)) {
            current.delete(id);
        } else {
            current.add(id);
        }
        this.expandedCards.set(current);
    }

    updateLineCount(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.lineCount.set(parseInt(value, 10));
    }
}
