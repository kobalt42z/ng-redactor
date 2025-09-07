import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PdfTextSelectionService {
  constructor() {
    // Listen for mouseup events on the document
    document.addEventListener('mouseup', this.logSelectedText);
  }

  private logSelectedText = async () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        // Find the parent .page element
        let node = range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
        let pageDiv: HTMLElement | null = null;
        while (node) {
          if (node.classList && node.classList.contains('page')) {
            pageDiv = node as HTMLElement;
            break;
          }
          node = node.parentElement;
        }
        if (!pageDiv) {
          console.log('Selected text:', text);
          console.log('Bounding box (screen):', rect);
          return;
        }
        const pageRect = pageDiv.getBoundingClientRect();
        const relLeft = rect.left - pageRect.left;
        const relTop = rect.top - pageRect.top;
        const relRight = rect.right - pageRect.left;
        const relBottom = rect.bottom - pageRect.top;
        const pageNumber = parseInt(pageDiv.getAttribute('data-page-number') || '1', 10);
        // Access pdf.js and viewer
        const pdfViewerApp = (window as any).PDFViewerApplication;
        if (!pdfViewerApp || !pdfViewerApp.pdfDocument || !pdfViewerApp.pdfViewer) {
          console.log('Selected text:', text);
          console.log('Bounding box (screen):', rect);
          return;
        }
        const pdfPage = await pdfViewerApp.pdfDocument.getPage(pageNumber);
        const viewport = pdfPage.getViewport({ scale: pdfViewerApp.pdfViewer.currentScale });
        // Convert all four corners to PDF coordinates
        const [pdfX1, pdfY1] = viewport.convertToPdfPoint(relLeft, relTop);
        const [pdfX2, pdfY2] = viewport.convertToPdfPoint(relRight, relBottom);
        const pdfBoundingBox = {
          x: Math.min(pdfX1, pdfX2),
          y: Math.min(pdfY1, pdfY2),
          width: Math.abs(pdfX2 - pdfX1),
          height: Math.abs(pdfY2 - pdfY1),
          page: pageNumber
        };
        console.log('Selected text:', text);
        console.log('Bounding box (PDF coordinates):', pdfBoundingBox);
      }
    }
  };
}
