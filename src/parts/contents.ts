import { MyDisplay } from "../core/myDisplay";
import { GridItems } from "./GridItems";
import { Visual } from "./visual";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {
  // dom images
  private _images: GridItems;

  constructor(opt: any) {
    super(opt);

    this._images = new GridItems();

    new Visual({
      el: document.querySelector(".l-canvas"),
      transparent: true,
      images: this._images.images,
    });
  }

  protected _update(): void {
    super._update();
    this._images.updateDrag();
  }

  protected _resize(): void {
    super._resize();
    this._images.resize();
  }
}
