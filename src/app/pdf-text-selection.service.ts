import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PdfTextSelectionService {
  constructor() {
    // Listen for mouseup events on the document
    document.addEventListener('mouseup', this.logSelectedText);
  }

  private logSelectedText = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString();
      let boundingBox = null;
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        boundingBox = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        };
      }
      console.log('Selected text:', text);
      console.log('Bounding box:', boundingBox);
    }
  };
}
