import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  computed,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FormsModule, CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  userName = signal('Angular User');
  pdfUrl = signal(
    'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  );

  // Example selection
  selectedExample = signal<'hello-world' | 'pdf-viewer'>('hello-world');

  examples = [
    { value: 'hello-world', label: 'Hello World Component' },
    { value: 'pdf-viewer', label: 'PDF Viewer Component' },
  ];

  // Window width signal
  private windowWidth = signal(0);

  constructor() {
    if (typeof window !== 'undefined') {
      this.windowWidth.set(window.innerWidth);
    }
  }

  // Update window width on resize
  @HostListener('window:resize')
  onResize() {
    this.windowWidth.set(window.innerWidth);
  }

  // Calculate responsive width for PDF viewer
  pdfViewerWidth = computed(() => {
    if (this.windowWidth() > 0) {
      return Math.min(750, this.windowWidth() - 100);
    }
    return 750;
  });

  onExampleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedExample.set(target.value as 'hello-world' | 'pdf-viewer');
  }

  onNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.userName.set(target.value);
  }

  onPdfUrlChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.pdfUrl.set(target.value);
  }
}
