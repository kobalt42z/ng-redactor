import { Component, ChangeDetectionStrategy } from '@angular/core';
import { input } from '@angular/core';
import { DrawingObject } from './drawing.service';
import { DrawingComponent } from './drawing-component';

@Component({
  selector: 'app-drawing-layer',
  imports: [DrawingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (objects().length > 0) {
      <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none;">
        @for (obj of objects(); track obj) {
          <app-drawing-component [bbox]="obj"></app-drawing-component>
        }
      </div>
    }
  `,
})
export class DrawingLayerComponent {
  objects = input.required<DrawingObject[]>();
  page = input.required<number>();
}