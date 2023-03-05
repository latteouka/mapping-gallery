import { MyDisplay } from "../core/myDisplay";
import { Images } from "./Images";
import { Visual } from "./visual";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {
  // dom images
  private _images: Images;

  constructor(opt: any) {
    super(opt);

    this._images = new Images();

    const visual = new Visual({
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
