import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawingObject } from '../../../drawing.service';

@Component({
  selector: 'app-drawing-element',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawing-element.component.html',
  styleUrls: ['./drawing-element.component.scss'],
})
export class DrawingElementComponent {
  // Use input() signal for reactive inputs
  bbox = input.required<DrawingObject>();

  // Computed properties for reactive positioning
  viewportCoords = computed(() => {
    const drawing = this.bbox();
    if (!drawing) return null;

    try {
      // Get PDF viewer application
      const pdfViewerApp = (window as any).PDFViewerApplication;
      if (!pdfViewerApp?.pdfViewer) return null;

      // Get the specific page view
      const pageView = pdfViewerApp.pdfViewer.getPageView(drawing.page - 1);
      if (!pageView?.viewport) return null;

      const viewport = pageView.viewport;
      
      // Convert PDF coordinates to viewport coordinates
      const [x1, y1] = viewport.convertToViewportPoint(drawing.x, drawing.y);
      const [x2, y2] = viewport.convertToViewportPoint(drawing.x + drawing.width, drawing.y + drawing.height);
      
      // Since the drawing layer is now a child of the page container,
      // we can use the viewport coordinates directly as they're relative to the page
      return {
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1)
      };
    } catch (error) {
      console.error('Error converting coordinates:', error);
      return null;
    }
  });

  // Computed styles for template binding
  elementStyles = computed(() => {
    const coords = this.viewportCoords();
    if (!coords) return { display: 'none' };

    return {
      position: 'absolute',
      left: `${coords.left}px`,
      top: `${coords.top}px`,
      width: `${coords.width}px`,
      height: `${coords.height}px`,
      backgroundColor: 'rgba(255, 255, 0, 0.3)',
      border: '1px solid rgba(255, 255, 0, 0.8)',
      pointerEvents: 'none',
      zIndex: '10'
    };
  });
}
