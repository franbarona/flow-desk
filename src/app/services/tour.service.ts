import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private intro: any;
  private readonly isBrowser: boolean;
  private onCompletedCallback: (() => void) | null = null;
  private clickListeners: AbortController | null = null;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private async loadIntroJs() {
    if (!this.isBrowser) return null;

    try {
      const module = await import('intro.js');
      return module.default();
    } catch (error) {
      console.error('Error loading intro.js:', error);
      return null;
    }
  }

  async initializeTour(steps: any[]) {
    if (!this.isBrowser) return;

    this.intro = await this.loadIntroJs();
    if (!this.intro) return;

    this.intro.setOptions({
      steps: steps,
      tooltipPosition: 'bottom',
      highlightClass: 'highlight',
      disableInteraction: false,
      scrollToElement: true,
      showBullets: false,
      exitOnEsc: true,
      exitOnOverlayClick: false,
      nextLabel: 'Next',
      prevLabel: 'Prev',
      doneLabel: 'Ready',
    });

    this.intro.onexit(() => {
      this.removeClickListeners();
      if (this.onCompletedCallback) {
        this.onCompletedCallback();
      }
    });

    this.setupClickListeners(steps);
  }

  private setupClickListeners(steps: any[]) {
    this.removeClickListeners();
    this.clickListeners = new AbortController();

    steps.forEach((step, index) => {
      if (step.element) {
        const element = document.querySelector(step.element);
        if (element) {
          element.addEventListener(
            'click',
            () => {
              if (index < steps.length - 1) {
                this.intro.nextStep();
              } else {
                this.intro.exit();
              }
            },
            { signal: this.clickListeners!.signal }
          );
        }
      }
    });
  }

  private removeClickListeners() {
    if (this.clickListeners) {
      this.clickListeners.abort();
      this.clickListeners = null;
    }
  }

  async startTour() {
    if (!this.isBrowser) return;
    if (!this.intro) {
      this.intro = await this.loadIntroJs();
    }
    this.intro?.start();
  }

  nextStep() {
    if (!this.isBrowser || !this.intro) return;
    this.intro.nextStep();
  }

  previousStep() {
    if (!this.isBrowser || !this.intro) return;
    this.intro.previousStep();
  }

  exitTour() {
    if (!this.isBrowser || !this.intro) return;
    this.removeClickListeners();
    this.intro.exit();
  }

  onTourCompleted(callback: () => void) {
    this.onCompletedCallback = callback;
  }
}
