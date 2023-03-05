import { Func } from "../core/func";
import { MousePointer } from "../core/mousePointer";
import { lenis } from "./SmoothScroll";

export class GridItems {
  targetName: string = ".image";
  images: Image[] = [];
  offsetX: number = 0;
  offsetY: number = 0;

  constructor() {
    this.init();
  }

  init() {
    // do resize translate first to get correct positions when init Image
    this.resize();

    const allImages = document.querySelectorAll(this.targetName);
    for (let i = 0; i < allImages.length; i++) {
      const image = allImages[i] as HTMLElement;
      const temp = new Image(image);
      this.images.push(temp);
    }

    lenis.on("scroll", ({ velocity }: any) => {
      this.updateImages(velocity);
    });
  }

  // call from contents update
  updateDrag() {
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].updateDrag();
    }
  }

  resize() {
    if (Func.instance.sw() < 800) {
      this.resize_sp();
    } else {
      this.resize_pc();
    }
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].resize();
    }
    this.updateImages(0);
  }

  resize_pc() {
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

  resize_sp() {
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

  // move images with scroll velocity
  updateImages(vel: number) {
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].update(vel);
    }
  }
}

export class Grid {
  private _element: HTMLElement;
  private _translateX: number;
  private _translateY: number;
  width: number;
  height: number;
  position: { x: number; y: number } = { x: 0, y: 0 };
  dragTarget: { x: number; y: number } = { x: 0, y: 0 };
  private _mousePointer: MousePointer;
  type: string = "default";

  constructor(image: HTMLElement) {
    this._element = image;
    this._mousePointer = MousePointer.instance;
    this._translateX = 0;
    this._translateY = 0;
    this.width = this._element.getBoundingClientRect().width;
    this.height = this._element.getBoundingClientRect().height;

    this.updateProperties();
  }

  update(vel: number) {
    if (Func.instance.sw() < 800) {
      this.update_sp(vel);
    } else {
      this.update_pc(vel);
    }
    this.updateProperties();
  }

  update_pc(vel: number) {
    // move item
    this._translateY += -vel;
    // top
    if (
      this._element.getBoundingClientRect().y <
      -Func.instance.sw() * 0.234375
    ) {
      this._translateY += Func.instance.sw() * 0.234375 * 3 + 180;
    }
    // left
    if (
      this._element.getBoundingClientRect().x <
      -Func.instance.sw() * 0.171875 * 1.5
    ) {
      this._translateX += Func.instance.sw() * 0.171875 * 6 + 360;
    }
    // right
    if (this._element.getBoundingClientRect().x > Func.instance.sw()) {
      this._translateX -= Func.instance.sw() * 0.171875 * 6 + 360;
    }
    // bottom
    if (this._element.getBoundingClientRect().y > Func.instance.sh()) {
      this._translateY -= Func.instance.sw() * 0.234375 * 3 + 180;
    }
    this._element.style.transform = `translate(${this._translateX}px, ${this._translateY}px)`;
  }

  update_sp(vel: number) {
    // move item
    this._translateY += -vel;

    // top
    if (
      this._element.getBoundingClientRect().y <
      -Func.instance.sw() * 0.704 * 2
    ) {
      this._translateY += Func.instance.sw() * 0.704 * 6 + 156;
    }
    // left
    if (
      this._element.getBoundingClientRect().x <
      -Func.instance.sw() * 0.46933333 * 2
    ) {
      this._translateX += Func.instance.sw() * 0.46933333 * 4 + 104;
    }
    // right
    if (this._element.getBoundingClientRect().x > Func.instance.sw() * 1.3) {
      this._translateX -= Func.instance.sw() * 0.46933333 * 4 + 104;
    }
    // bottom
    if (
      this._element.getBoundingClientRect().y >
      Func.instance.sh() + Func.instance.sw() * 0.704
    ) {
      this._translateY -= Func.instance.sw() * 0.704 * 6 + 156;
    }
    this._element.style.transform = `translate(${this._translateX}px , ${this._translateY}px)`;
  }

  updateDrag() {
    this._translateX += this._mousePointer.velocityX;
    this._translateY += this._mousePointer.velocityY;

    this._element.style.transform = `translate(${this._translateX}px, ${this._translateY}px)`;
    this.update(0);
    this.updateProperties();
  }

  updateProperties() {
    this.width = this._element.getBoundingClientRect().width;
    this.height = this._element.getBoundingClientRect().height;
    this.position = {
      x:
        -window.innerWidth / 2 +
        this.width / 2 +
        this._element.getBoundingClientRect().x,

      y:
        window.innerHeight / 2 -
        this.height / 2 -
        this._element.getBoundingClientRect().y,
    };
  }

  resize() {
    this.reset();
    this.update(0);
    this.updateProperties();
  }

  reset() {
    this._element.style.transform = `translate(0px, 0px)`;
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
