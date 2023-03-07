import { MyDisplay } from "../core/myDisplay";
import { Param } from "../core/param";
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

    new Param();
  }

  protected _update(): void {
    super._update();
  }

  protected _resize(): void {
    super._resize();
  }
}
