import { Point } from "../libs/point";
import { Update } from "../libs/update";
import { Util } from "../libs/util";

export class MousePointer {
  private static _instance: MousePointer;

  // callbacks for move
  private _list: Array<Function> = [];

  public x: number = window.innerWidth * 0.5;
  public y: number = window.innerHeight * 0.5;
  public old: Point = new Point();
  public lerpOld: Point = new Point();
  public normal: Point = new Point();
  public easeNormal: Point = new Point();
  public start: Point = new Point();
  public last: Point = new Point();
  public moveDist: Point = new Point();
  public dist: number = 0;
  public isDown: boolean = false;
  public isDragging: boolean = false;
  public velocityX: number = 0;
  public velocityY: number = 0;
  public velocityAlways: Point = new Point();

  public onSwipe: any;

  private _updateHandler: any;

  constructor() {
    // const tg = document.querySelector(".l-canvas") || window;
    // this.setListeners();
    this._updateHandler = this._update.bind(this);
    Update.instance.add(this._updateHandler);
  }

  public setListeners() {
    window.addEventListener("pointerdown", (e: any = {}) => {
      this._eDown(e);
    });
    window.addEventListener("pointerup", () => {
      this._eUp();
    });
    window.addEventListener("pointermove", (e: any = {}) => {
      this._eMove(e);
    });
  }
  public removeListeners() {
    window.removeEventListener("pointerdown", (e: any = {}) => {
      this._eDown(e);
    });
    window.removeEventListener("pointerup", () => {
      this._eUp();
    });
    window.removeEventListener("pointermove", (e: any = {}) => {
      this._eMove(e);
    });
  }

  public static get instance(): MousePointer {
    if (!this._instance) {
      this._instance = new MousePointer();
    }
    return this._instance;
  }

  // private _eTouchStart(e: any = {}): void {
  //   this.isDown = true;
  //   this._eTouchMove(e);
  //
  //   const p: Point = this._getTouchPoint(e);
  //   this.start.x = p.x;
  //   this.start.y = p.y;
  //
  //   this.lerpOld.x = this.x;
  //   this.lerpOld.y = this.y;
  // }
  //
  // private _eTouchEnd(): void {
  //   this.isDown = false;
  //
  //   // 上下スワイプ判定
  //   const dx = this.old.x - this.x;
  //   const dy = this.old.y - this.y;
  //   // console.log(Math.abs(dy))
  //   if (Math.abs(dy) > 0 || Math.abs(dx) > 0) {
  //     if (this.onSwipe != undefined) this.onSwipe({ move: dy });
  //   }
  //
  //   this.dist = 0;
  //   // console.log(dy)
  //   // Param.instance.setMemo(dx + ',' + dy)
  // }

  // private _eTouchMove(e: any = {}): void {
  //   const p: Point = this._getTouchPoint(e);
  //   this.old.x = this.x;
  //   this.old.y = this.y;
  //
  //   this.x = p.x;
  //   this.y = p.y;
  //
  //   // record last point when isDown
  //   if (this.isDown) {
  //     this.last.x = this.x;
  //     this.last.y = this.y;
  //   }
  //
  //   const dx = this.old.x - this.x;
  //   const dy = this.old.y - this.y;
  //   this.dist = Math.sqrt(dx * dx + dy * dy);
  //
  //   if (this.usePreventDefault) {
  //     e.preventDefault();
  //   }
  // }
  //
  private _eDown(e: any = {}): void {
    // e.preventDefault();
    e.stopPropagation();
    this.isDown = true;
    this._eMove(e);

    this.start.x = this.x;
    this.start.y = this.y;

    this.last.x = this.x;
    this.last.y = this.y;

    this.lerpOld.x = this.x;
    this.lerpOld.y = this.y;
  }

  private _eUp(): void {
    this.isDown = false;
  }

  private _eMove(e: any = {}): void {
    this.dist = 0;
    // e.preventDefault();
    e.stopPropagation();
    this.old.x = this.x;
    this.old.y = this.y;

    // record last point when isDown
    if (this.isDown) {
      this.last.x = this.x;
      this.last.y = this.y;
    }

    this.x = e.clientX;
    this.y = e.clientY;

    const dx = this.old.x - this.x;
    const dy = this.old.y - this.y;
    this.dist = Math.sqrt(dx * dx + dy * dy);

    if (this.isDown && this.dist > 0) {
      this.isDragging = true;
    } else {
      this.isDragging = false;
    }

    // run callbacks
    this._call();
  }

  // private _getTouchPoint(e: TouchEvent): Point {
  //   const p = new Point();
  //   const touches: TouchList = e.touches;
  //   if (touches != null && touches.length > 0) {
  //     p.x = touches[0].pageX;
  //     p.y = touches[0].pageY;
  //   }
  //   return p;
  // }

  private _update(): void {
    if (this.isDown) {
      this.moveDist.x = this.start.x - this.x;
      this.moveDist.y = this.start.y - this.y;
    } else {
      this.moveDist.x += (0 - this.moveDist.x) * 0.25;
      this.moveDist.y += (0 - this.moveDist.y) * 0.25;
    }

    /////////
    const offsetX = (this.last.x - this.lerpOld.x) * 0.1;
    const offsetY = (this.last.y - this.lerpOld.y) * 0.1;

    this.lerpOld.x += offsetX;
    this.lerpOld.y += offsetY;

    this.velocityX = offsetX;
    this.velocityY = offsetY;

    this.velocityAlways.set(this.x - this.old.x, this.y - this.old.y);
    /////////

    this.normal.x = Util.instance.map(this.x, -1, 1, 0, window.innerWidth);
    this.normal.y = Util.instance.map(this.y, -1, 1, 0, window.innerHeight);

    const ease = 0.1;
    this.easeNormal.x += (this.normal.x - this.easeNormal.x) * ease;
    this.easeNormal.y += (this.normal.y - this.easeNormal.y) * ease;
  }

  public add(f: Function) {
    this._list.push(f);
  }

  public remove(f: Function) {
    const arr: Array<Function> = [];
    this._list.forEach((val) => {
      if (val != f) {
        arr.push(val);
      }
    });
    this._list = arr;
  }

  private _call = () => {
    for (var item of this._list) {
      if (item != null) item();
    }
  };
}
