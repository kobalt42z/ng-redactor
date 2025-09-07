
import { Component, ChangeDetectionStrategy, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { input } from '@angular/core';
import { DrawingObject } from '../../../drawing.service';
import { DrawingElementComponent } from '../element/drawing-element.component';

@Component({
  selector: 'app-drawing-layer',
  imports: [DrawingElementComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drawing-layer.component.html',
  styleUrls: ['./drawing-layer.component.scss'],
})
export class DrawingLayerComponent implements OnInit {
  objects = input.required<DrawingObject[]>();
  page = input.required<number>();

  left = 0;
  top = 0;
  width = 0;
  height = 0;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    // Wait for PDF viewer to be ready and find the specific page
    const pageDiv = document.querySelector(
      `.page[data-page-number='${this.page()}']`
    ) as HTMLElement;
    
    if (!pageDiv) {
      console.log(`[DrawingLayerComponent] Page ${this.page()} not found`);
      // Retry after a short delay
      setTimeout(() => this.ngOnInit(), 100);
      return;
    }

    const pdfViewerApp = (window as any).PDFViewerApplication;
    if (!pdfViewerApp || !pdfViewerApp.pdfDocument || !pdfViewerApp.pdfViewer) {
      console.log('[DrawingLayerComponent] PDF viewer not ready');
      setTimeout(() => this.ngOnInit(), 100);
      return;
    }

    try {
      const pdfPage = await pdfViewerApp.pdfDocument.getPage(this.page());
      const viewport = pdfPage.getViewport({ scale: pdfViewerApp.pdfViewer.currentScale });
      
      // Set layer size to match the PDF page viewport exactly
      this.width = viewport.width;
      this.height = viewport.height;
      
      // Position the layer absolutely over the PDF page
      const pageRect = pageDiv.getBoundingClientRect();
      const appContainer = this.el.nativeElement.parentElement;
      
      if (appContainer) {
        const containerRect = appContainer.getBoundingClientRect();
        this.left = pageRect.left - containerRect.left;
        this.top = pageRect.top - containerRect.top;
      } else {
        this.left = 0;
        this.top = 0;
      }
      
      // Force change detection
      this.cdr.detectChanges();
      
      console.log(`[DrawingLayerComponent] Layer ${this.page()} positioned:`, {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        objects: this.objects().length,
        pageRect: pageRect,
        containerRect: appContainer?.getBoundingClientRect()
      });
      
    } catch (error) {
      console.error('[DrawingLayerComponent] Error:', error);
    }
  }
}
