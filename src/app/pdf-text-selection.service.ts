import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfTextSelectionService {
  private selectionSubject = new Subject<any>();
  public selection$: Observable<any> = this.selectionSubject.asObservable();

  constructor() {
    document.addEventListener('mouseup', this.emitSelectedText);
  }

  private emitSelectedText = async () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        let node = range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
        let pageDiv: HTMLElement | null = null;
        while (node) {
          if (node.classList && node.classList.contains('page')) {
            pageDiv = node as HTMLElement;
            break;
          }
          node = node.parentElement;
        }
        if (!pageDiv) return;
        const pageRect = pageDiv.getBoundingClientRect();
        const relLeft = rect.left - pageRect.left;
        const relTop = rect.top - pageRect.top;
        const relRight = rect.right - pageRect.left;
        const relBottom = rect.bottom - pageRect.top;
        const pageNumber = parseInt(pageDiv.getAttribute('data-page-number') || '1', 10);
        const pdfViewerApp = (window as any).PDFViewerApplication;
        if (!pdfViewerApp || !pdfViewerApp.pdfDocument || !pdfViewerApp.pdfViewer) return;
        const pdfPage = await pdfViewerApp.pdfDocument.getPage(pageNumber);
        const viewport = pdfPage.getViewport({ scale: pdfViewerApp.pdfViewer.currentScale });
        const [pdfX1, pdfY1] = viewport.convertToPdfPoint(relLeft, relTop);
        const [pdfX2, pdfY2] = viewport.convertToPdfPoint(relRight, relBottom);
        const pdfBoundingBox = {
          x: Math.min(pdfX1, pdfX2),
          y: Math.min(pdfY1, pdfY2),
          width: Math.abs(pdfX2 - pdfX1),
          height: Math.abs(pdfY2 - pdfY1),
          page: pageNumber,
          text
        };
        this.selectionSubject.next(pdfBoundingBox);
      }
    }
  };
}
}
