import { Component, Input, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { DrawingObject } from '../../../drawing.service';

@Component({
  selector: 'app-drawing-element',
  standalone: true,
  templateUrl: './drawing-element.component.html',
  styleUrls: ['./drawing-element.component.scss'],
})
export class DrawingElementComponent implements OnInit {
  @Input() bbox!: DrawingObject;

  // These will be used in the template for correct positioning
  left = 0;
  top = 0;
  width = 0;
  height = 0;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    // Convert PDF coordinates to viewport (screen) coordinates
    const pdfViewerApp = (window as any).PDFViewerApplication;
    if (!pdfViewerApp || !pdfViewerApp.pdfDocument || !pdfViewerApp.pdfViewer) {
      console.log('[DrawingElementComponent] PDF viewer not ready');
      return;
    }
    
    try {
      const pdfPage = await pdfViewerApp.pdfDocument.getPage(this.bbox.page);
      const viewport = pdfPage.getViewport({ scale: pdfViewerApp.pdfViewer.currentScale });
      
      // Convert PDF points to viewport points
      const [x1, y1] = viewport.convertToViewportPoint(this.bbox.x, this.bbox.y);
      const [x2, y2] = viewport.convertToViewportPoint(this.bbox.x + this.bbox.width, this.bbox.y + this.bbox.height);
      
      this.left = Math.min(x1, x2);
      this.top = Math.min(y1, y2);
      this.width = Math.abs(x2 - x1);
      this.height = Math.abs(y2 - y1);
      
      // Force change detection
      this.cdr.detectChanges();
      
      // Debug logging
      console.log('[DrawingElementComponent] bbox:', this.bbox);
      console.log('[DrawingElementComponent] viewport scale:', viewport.scale);
      console.log('[DrawingElementComponent] PDF points:', {x1: this.bbox.x, y1: this.bbox.y, x2: this.bbox.x + this.bbox.width, y2: this.bbox.y + this.bbox.height});
      console.log('[DrawingElementComponent] Viewport points:', {x1, y1, x2, y2});
      console.log('[DrawingElementComponent] Final position:', {left: this.left, top: this.top, width: this.width, height: this.height});
      
      // Force change detection
      setTimeout(() => {
        console.log('[DrawingElementComponent] Element rendered with size:', this.width, 'x', this.height);
      }, 100);
      
    } catch (error) {
      console.error('[DrawingElementComponent] Error:', error);
    }
  }
}
