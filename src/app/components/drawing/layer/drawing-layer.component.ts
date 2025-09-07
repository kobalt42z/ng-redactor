
import { Component, ChangeDetectionStrategy, computed, effect, signal, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawingObject } from '../../../drawing.service';
import { DrawingElementComponent } from '../element/drawing-element.component';

@Component({
  selector: 'app-drawing-layer',
  imports: [CommonModule, DrawingElementComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drawing-layer.component.html',
  styleUrls: ['./drawing-layer.component.scss'],
})
export class DrawingLayerComponent implements AfterViewInit {
  objects = input.required<DrawingObject[]>();
  page = input.required<number>();
  
  // Signal to track if the layer is properly attached to the page
  private attached = signal(false);

  // Signals for dynamic style
  private width = signal('100%');
  private height = signal('100%');
  private top = signal('0px');
  private left = signal('0px');

  // Computed layer styles for template binding
  layerStyles = computed(() => {
    return {
      position: 'absolute' as const,
      top: this.top(),
      left: this.left(),
      width: this.width(),
      height: this.height(),
      pointerEvents: 'none' as const,
      zIndex: '10',
    };
  });

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Effect to attach to page when page changes or objects are added
    effect(() => {
      const pageNumber = this.page();
      const objects = this.objects();
      if (objects.length > 0) {
        this.attachToPageContainer(pageNumber);
      }
    });
  }

  ngAfterViewInit() {
    // Try to attach after view init
    if (this.objects().length > 0) {
      this.attachToPageContainer(this.page());
    }
  }

  private attachToPageContainer(pageNumber: number) {
    // Find the specific PDF page container
    const pageDiv = document.querySelector(
      `.page[data-page-number='${pageNumber}']`
    ) as HTMLElement;

    if (!pageDiv) {
      throw new Error(`[DrawingLayerComponent] Page ${pageNumber} not found. Make sure to call attachToPageContainer only after rendering event.`);
    }

    // Find the canvas inside the page
    const canvas = pageDiv.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`[DrawingLayerComponent] Canvas for page ${pageNumber} not found. Make sure to call attachToPageContainer only after rendering event.`);
    }

    const element = this.el.nativeElement;

    // Only attach if not already attached to this page
    if (element.parentElement !== pageDiv) {
      // Make sure the page container has relative positioning
      if (pageDiv.style.position !== 'relative') {
        pageDiv.style.position = 'relative';
      }

      // Remove from current parent if attached elsewhere
      if (element.parentElement) {
        element.parentElement.removeChild(element);
      }

      // Append directly to the page container
      pageDiv.appendChild(element);
      this.attached.set(true);
    }

    // Get canvas position and size relative to pageDiv
    const left = canvas.offsetLeft;
    const top = canvas.offsetTop;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    this.left.set(left + 'px');
    this.top.set(top + 'px');
    this.width.set(width + 'px');
    this.height.set(height + 'px');

    // Optionally, listen for canvas resize (if zooming, etc.)
    if ((window as any).ResizeObserver) {
      const ro = new (window as any).ResizeObserver(() => {
        this.left.set(canvas.offsetLeft + 'px');
        this.top.set(canvas.offsetTop + 'px');
        this.width.set(canvas.offsetWidth + 'px');
        this.height.set(canvas.offsetHeight + 'px');
      });
      ro.observe(canvas);
    }
  }
}
