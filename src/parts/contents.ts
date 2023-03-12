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

    // setTimeout(() => {
    //   lenis.scrollTo(3000, {
    //     easing: (x) =>
    //       x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    //   });
    // }, 3000);
  }

  protected _update(): void {
    super._update();
  }

  protected _resize(): void {
    super._resize();
  }
}
