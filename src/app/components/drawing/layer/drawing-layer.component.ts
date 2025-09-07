
import { Component, ChangeDetectionStrategy, computed, effect, signal, ElementRef, AfterViewInit } from '@angular/core';
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
  
  // Computed layer styles for template binding
  layerStyles = computed(() => {
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

  constructor(private el: ElementRef) {
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
      console.log(`[DrawingLayerComponent] Page ${pageNumber} not found, retrying...`);
      // Retry after a short delay
      setTimeout(() => this.attachToPageContainer(pageNumber), 100);
      return;
    }

    try {
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
        console.log(`[DrawingLayerComponent] Layer ${pageNumber} attached to page container with ${this.objects().length} objects`);
      }
      
    } catch (error) {
      console.error('[DrawingLayerComponent] Error attaching to page:', error);
    }
  }
}
