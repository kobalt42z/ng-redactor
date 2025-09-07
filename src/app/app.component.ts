

import { Component, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawingLayerComponent } from './components/drawing/layer/drawing-layer.component';
import { PdfTextSelectionService } from './pdf-text-selection.service';
import { DrawingService, DrawingObject } from './drawing.service';
import { RouterOutlet } from '@angular/router';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxExtendedPdfViewerModule, DrawingLayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ng-redactor';
  pdfSrc = 'assets/test.pdf';
  
  // Signal-based drawing objects
  drawingObjects = signal<{ [page: number]: DrawingObject[] }>({});
  
  // Computed property to get unique pages with objects
  pagesWithObjects = computed(() => {
    const objects = this.drawingObjects();
    return Object.keys(objects).map(page => parseInt(page)).filter(page => objects[page].length > 0);
  });
  
  private sub: any;

  constructor(
    private pdfTextSelectionService: PdfTextSelectionService,
    private drawingService: DrawingService
  ) {}

  ngOnInit() {
    this.sub = this.pdfTextSelectionService.selection$.subscribe((bbox) => {
      this.drawingService.addObject(bbox);
      // Update the signal with new objects
      this.drawingObjects.set({ ...this.drawingService.getAllObjects() });
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
  
  // Helper method to get objects for a specific page
  getObjectsForPage(page: number): DrawingObject[] {
    return this.drawingObjects()[page] || [];
  }
}
