import { Func } from "../core/func";
import { MousePointer } from "../core/mousePointer";
import { Resize } from "../libs/resize";
import { Update } from "../libs/update";
import { lenis } from "./SmoothScroll";

export class GridItems {
  targetName: string = ".image";
  images: Image[] = [];
  offsetX: number = 0;
  offsetY: number = 0;
  private _layoutHandler: any;

  constructor() {
    this.init();

    this._layoutHandler = this._resize.bind(this);
    Resize.instance.add(this._layoutHandler);
  }

  init() {
    // do resize translate first to get correct positions before init Image
    this._resize();

    // generate all grid(Image)
    const allImages = document.querySelectorAll(this.targetName);
    for (let i = 0; i < allImages.length; i++) {
      const image = allImages[i] as HTMLElement;
      const temp = new Image(image);
      this.images.push(temp);
    }
  }

  private _resize() {
    if (Func.instance.sw() < 800) {
      this.resize_sp();
    } else {
      this.resize_pc();
    }
  }

  private resize_pc() {
    const gallery = document.querySelector(".gallery")! as HTMLElement;

    // responsive gallery
    const galleryHeight = gallery.clientHeight;
    this.offsetX =
      Func.instance.sw() * 0.171875 -
      (Func.instance.sw() - Func.instance.sw() * 0.171875 * 4 - 300) / 2 +
      30;
    this.offsetY = (Func.instance.sh() - galleryHeight) / 2;
    gallery.style.transform = `translate(-${this.offsetX}px, ${this.offsetY}px)`;
  }

  private resize_sp() {
    const gallery = document.querySelector(".gallery")! as HTMLElement;

    // responsive gallery
    const galleryHeight = gallery.clientHeight;
    this.offsetX =
      Func.instance.sw() * 0.46933333 -
      (Func.instance.sw() - Func.instance.sw() * 0.46933333 * 2 - 78) / 2 +
      13;
    this.offsetY = (Func.instance.sh() - galleryHeight) / 2;
    gallery.style.transform = `translate(-${this.offsetX}px, ${this.offsetY}px)`;
  }
}

export class Grid {
  public element: HTMLElement;
  private _translateX: number;
  private _translateY: number;
  width: number;
  height: number;
  position: { x: number; y: number } = { x: 0, y: 0 };
  dragTarget: { x: number; y: number } = { x: 0, y: 0 };
  type: string = "default";

  private _dragHandler: any;
  private _layoutHandler: any;

  constructor(image: HTMLElement) {
    this.element = image;
    this._translateX = 0;
    this._translateY = 0;
    this.width = this.element.getBoundingClientRect().width;
    this.height = this.element.getBoundingClientRect().height;

    // add drag to update loop
    // because we need drag animation to update even when user has released touch
    this._dragHandler = this._updateDrag.bind(this);
    Update.instance.add(this._dragHandler);
    this._layoutHandler = this._resize.bind(this);
    Resize.instance.add(this._layoutHandler);

    lenis.on("scroll", ({ velocity }: any) => {
      this._translate(velocity);
    });
  }

  // run on scroll
  private _translate(vel: number) {
    if (Func.instance.sw() < 800) {
      this.update_sp(vel);
    } else {
      this.update_pc(vel);
    }
    this._updateProperties();
  }

  // 6 * 4
  private update_pc(vel: number) {
    // move item
    this._translateY += -vel;
    // top
    if (
      this.element.getBoundingClientRect().y <
      -Func.instance.sw() * 0.234375 * 1.5
    ) {
      this._translateY += Func.instance.sw() * 0.234375 * 4 + 240;
    }
    // left
    if (
      this.element.getBoundingClientRect().x <
      -Func.instance.sw() * 0.171875 * 1.5
    ) {
      this._translateX += Func.instance.sw() * 0.171875 * 6 + 360;
    }
    // right
    if (this.element.getBoundingClientRect().x > Func.instance.sw()) {
      this._translateX -= Func.instance.sw() * 0.171875 * 6 + 360;
    }
    // bottom
    if (
      this.element.getBoundingClientRect().y >
      Func.instance.sh() + Func.instance.sw() * 0.234375
    ) {
      this._translateY -= Func.instance.sw() * 0.234375 * 4 + 240;
    }
    this.element.style.transform = `translate(${this._translateX}px, ${this._translateY}px)`;
  }

  // 4 * 6
  private update_sp(vel: number) {
    // move item
    this._translateY += -vel;

    // top
    if (
      this.element.getBoundingClientRect().y <
      -Func.instance.sw() * 0.704 * 2
    ) {
      this._translateY += Func.instance.sw() * 0.704 * 6 + 156;
    }
    // left
    if (
      this.element.getBoundingClientRect().x <
      -Func.instance.sw() * 0.46933333 * 2
    ) {
      this._translateX += Func.instance.sw() * 0.46933333 * 4 + 104;
    }
    // right
    if (this.element.getBoundingClientRect().x > Func.instance.sw() * 1.3) {
      this._translateX -= Func.instance.sw() * 0.46933333 * 4 + 104;
    }
    // bottom
    if (
      this.element.getBoundingClientRect().y >
      Func.instance.sh() + Func.instance.sw() * 0.704
    ) {
      this._translateY -= Func.instance.sw() * 0.704 * 6 + 156;
    }
    this.element.style.transform = `translate(${this._translateX}px , ${this._translateY}px)`;
  }

  private _updateDrag() {
    // keep moving after touchleave
    this._translateX += MousePointer.instance.velocityX * 2;
    this._translateY += MousePointer.instance.velocityY * 2;

    this.element.style.transform = `translate(${this._translateX}px, ${this._translateY}px)`;
    this._translate(0);
  }

  // update everything for threejs item's reference
  private _updateProperties() {
    this.width = this.element.getBoundingClientRect().width;
    this.height = this.element.getBoundingClientRect().height;
    this.position = {
      x:
        -window.innerWidth / 2 +
        this.width / 2 +
        this.element.getBoundingClientRect().x,

      y:
        window.innerHeight / 2 -
        this.height / 2 -
        this.element.getBoundingClientRect().y,
    };
  }

  private _resize() {
    this._reset();
  }

  private _reset() {
    this.element.style.transform = `translate(0px, 0px)`;
    this._translateX = 0;
    this._translateY = 0;
  }
}

export class Image extends Grid {
  img: string;
  constructor(image: HTMLElement) {
    super(image);

    this.type = "image";
    this.img = getComputedStyle(image)
      .getPropertyValue("background-image")
      .replace(/^url\(["']?/, "")
      .replace(/["']?\)$/, "");
  }
}
