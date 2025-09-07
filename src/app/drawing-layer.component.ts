import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { DrawingObject } from './drawing.service';

@Component({
  selector: 'app-drawing-layer',
  standalone: true,
  template: '',
})
export class DrawingLayerComponent implements AfterViewInit, OnChanges {
  @Input() objects: DrawingObject[] = [];
  @Input() page: number = 1;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.renderOverlays();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['objects']) {
      this.renderOverlays();
    }
  }

  private renderOverlays() {
    // Remove old overlays
    const pageDiv = this.getPageDiv();
    if (!pageDiv) return;
    // Remove previous overlays
    pageDiv.querySelectorAll('.drawing-overlay').forEach(e => e.remove());
    // Add overlays
    for (const obj of this.objects) {
      const overlay = document.createElement('div');
      overlay.className = 'drawing-overlay';
      overlay.style.position = 'absolute';
      overlay.style.left = obj.x + 'px';
      overlay.style.top = obj.y + 'px';
      overlay.style.width = obj.width + 'px';
      overlay.style.height = obj.height + 'px';
      overlay.style.border = '2px solid red';
      overlay.style.pointerEvents = 'none';
      overlay.setAttribute('data-page', obj.page.toString());
      pageDiv.appendChild(overlay);
    }
  }

  private getPageDiv(): HTMLElement | null {
    // Find the .page element for this page
    return document.querySelector('.page[data-page-number="' + this.page + '"]');
  }
}