// services/window-size.service.ts
import { Injectable, signal, afterNextRender } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService {
  private readonly _isLargeScreen = signal(false);
  
  // Signal público de solo lectura
  readonly isLargeScreen = this._isLargeScreen.asReadonly();

  constructor() {
    // Solo se ejecuta en el navegador después del primer render
    afterNextRender(() => {
      // Establece el valor inicial
      this._isLargeScreen.set(globalThis.innerWidth >= 1024);
      
      // Escucha los cambios de tamaño
      fromEvent(globalThis, 'resize').subscribe(() => {
        this._isLargeScreen.set(globalThis.innerWidth >= 1024);
      });
    });
  }
}