
import { Component, ChangeDetectionStrategy, ElementRef, OnInit } from '@angular/core';
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

  constructor(private el: ElementRef) {}

  async ngOnInit() {
    // Get the PDF page viewport and set the layer size/position to match
    const pdfViewerApp = (window as any).PDFViewerApplication;
    if (!pdfViewerApp || !pdfViewerApp.pdfDocument || !pdfViewerApp.pdfViewer) return;
    const pdfPage = await pdfViewerApp.pdfDocument.getPage(this.page());
    const viewport = pdfPage.getViewport({ scale: pdfViewerApp.pdfViewer.currentScale });
    // The viewport's transform gives the offset and scale
    this.width = viewport.width;
    this.height = viewport.height;
    // Find the page container to get its position relative to the PDF viewer
    const pageDiv = document.querySelector(
      `.page[data-page-number='${this.page()}']`
    ) as HTMLElement;
    if (pageDiv) {
      const rect = pageDiv.getBoundingClientRect();
      const parentRect = pageDiv.parentElement?.getBoundingClientRect();
      if (parentRect) {
        this.left = rect.left - parentRect.left;
        this.top = rect.top - parentRect.top;
      } else {
        this.left = rect.left;
        this.top = rect.top;
      }
    }
  }
}
