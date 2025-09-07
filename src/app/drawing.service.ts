import { Injectable } from '@angular/core';

export interface DrawingObject {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  text?: string;
}

@Injectable({ providedIn: 'root' })
export class DrawingService {
  // Map page number to array of drawing objects
  private objectsByPage: { [page: number]: DrawingObject[] } = {};

  getObjects(page: number): DrawingObject[] {
    return this.objectsByPage[page] || [];
  }

  addObject(obj: DrawingObject) {
    if (!this.objectsByPage[obj.page]) {
      this.objectsByPage[obj.page] = [];
    }
    this.objectsByPage[obj.page].push(obj);
  }

  getAllObjects() {
    return this.objectsByPage;
  }
}