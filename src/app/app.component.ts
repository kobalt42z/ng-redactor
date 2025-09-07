

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfTextSelectionService } from './pdf-text-selection.service';
import { DrawingService, DrawingObject } from './drawing.service';
import { RouterOutlet } from '@angular/router';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxExtendedPdfViewerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ng-redactor';
  pdfSrc = 'assets/test.pdf';
  drawingObjects: { [page: number]: DrawingObject[] } = {};
  private sub: any;

  constructor(
    private pdfTextSelectionService: PdfTextSelectionService,
    private drawingService: DrawingService
  ) {}

  ngOnInit() {
    this.sub = this.pdfTextSelectionService.selection$.subscribe((bbox) => {
      this.drawingService.addObject(bbox);
      this.drawingObjects = { ...this.drawingService.getAllObjects() };
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
