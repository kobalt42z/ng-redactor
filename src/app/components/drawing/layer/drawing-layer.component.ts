import { Component, ChangeDetectionStrategy } from '@angular/core';
import { input } from '@angular/core';
import { DrawingObject } from '../../../drawing.service';
import { DrawingElementComponent } from '../element/drawing-element.component';

@Component({
  selector: 'app-drawing-layer',
  imports: [DrawingElementComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drawing-layer.component.html',
})
export class DrawingLayerComponent {
  objects = input.required<DrawingObject[]>();
  page = input.required<number>();
}
