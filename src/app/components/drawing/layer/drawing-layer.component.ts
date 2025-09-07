
import { Component, ChangeDetectionStrategy, computed, effect, signal } from '@angular/core';
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
export class DrawingLayerComponent {
  objects = input.required<DrawingObject[]>();
  page = input.required<number>();
  
  // Signal to track if page positioning is ready
  private pageReady = signal(false);
  
  // Computed layer styles for template binding
  layerStyles = computed(() => {
    const pageNumber = this.page();
    const ready = this.pageReady();
    
    if (!ready) {
      // Try to find the page
      this.checkPageAvailability(pageNumber);
      return { display: 'none' }; // Hide until positioned
    }
    
    return {
      position: 'absolute' as const,
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none' as const,
      zIndex: '10'
    };
  });

  constructor() {
    // Effect to check page availability when page changes
    effect(() => {
      const pageNumber = this.page();
      this.checkPageAvailability(pageNumber);
    });
  }

  private checkPageAvailability(pageNumber: number) {
    // Find the specific PDF page container
    const pageDiv = document.querySelector(
      `.page[data-page-number='${pageNumber}']`
    ) as HTMLElement;
    
    if (pageDiv) {
      this.pageReady.set(true);
      console.log(`[DrawingLayerComponent] Page ${pageNumber} ready with ${this.objects().length} objects`);
    } else {
      this.pageReady.set(false);
      // Retry after a short delay
      setTimeout(() => this.checkPageAvailability(pageNumber), 100);
    }
  }
}
