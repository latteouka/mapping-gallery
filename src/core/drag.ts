export class Drag {
  private static _instance: Drag;
  private dom: HTMLElement;
  dragging: boolean = false;
  isTouchScreen: boolean;

  public static get instance(): Drag {
    if (!this._instance) {
      this._instance = new Drag();
    }
    return this._instance;
  }

  constructor(dom: HTMLElement) {
    // check if touchscreen
    this.isTouchScreen =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    this.dom = dom;
    this.init();
  }

  init() {
    if (this.isTouchScreen) {
      this.dom.addEventListener("touchstart", this.onStart);
      this.dom.addEventListener("touchmove", this.onMove);
      this.dom.addEventListener("touchend", this.onEnd);
    } else {
      this.dom.addEventListener("touchstart", this.onStart);
      this.dom.addEventListener("mousemove", this.onMove);
      this.dom.addEventListener("mouseup", this.onEnd);
    }
  }

  onStart(event: TouchEvent | MouseEvent) {
    this.dragging = true;
  }

  onMove(event: TouchEvent | MouseEvent) {}

  onEnd() {
    this.dragging = false;
  }
}
