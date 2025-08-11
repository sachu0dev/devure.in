declare module "locomotive-scroll" {
    export default class LocomotiveScroll {
      constructor(options: {
        el: Element | null;
        smooth?: boolean;
        multiplier?: number;
        inertia?: number;
        smartphone?: {
          smooth?: boolean;
        };
      });
  
      destroy(): void;
      update(): void;
      // Add other methods and properties as needed
    }
  }