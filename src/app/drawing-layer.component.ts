import { Component, ChangeDetectionStrategy } from '@angular/core';
import { input } from '@angular/core';
import { DrawingObject } from './drawing.service';
import { DrawingElementComponent } from './drawing/drawing-element.component';

@Component({
  selector: 'app-drawing-layer',
  imports: [DrawingElementComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (objects().length > 0) {
      <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none;">
        @for (obj of objects(); track obj) {
          <app-drawing-element [bbox]="obj"></app-drawing-element>
        }
      </div>
    }
  `,
})
export class DrawingLayerComponent {
  objects = input.required<DrawingObject[]>();
  page = input.required<number>();
}