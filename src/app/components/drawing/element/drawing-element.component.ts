import { Component, Input } from '@angular/core';
import { DrawingObject } from '../../../drawing.service';

@Component({
  selector: 'app-drawing-element',
  standalone: true,
  templateUrl: './drawing-element.component.html',
  styleUrls: ['./drawing-element.component.css'],
})
export class DrawingElementComponent {
  @Input() bbox!: DrawingObject;
}
