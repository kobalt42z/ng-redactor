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
      console.log('Selected text:', selection.toString());
    }
  };
}
