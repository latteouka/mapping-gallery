import { Func } from "../core/func";
import { MousePointer } from "../core/mousePointer";
import { lenis } from "./SmoothScroll";

export class Images {
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

    // all images
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].resize();
    }

    this.updatePosition();
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

    // all images
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].resize();
    }

    this.updatePosition();
  }

  // move images with scroll velocity
  updateImages(vel: number) {
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].update(vel);
    }
  }

  // update positions
  updatePosition() {
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].updateProperties();
    }
  }
}

export class Image {
  private _element: HTMLElement;
  private _translateX: number;
  private _translateY: number;
  width: number;
  height: number;
  color: string;
  img: string;
  position: { x: number; y: number } = { x: 0, y: 0 };
  dragTarget: { x: number; y: number } = { x: 0, y: 0 };
  private _mousePointer: MousePointer;

  constructor(image: HTMLElement) {
    this._element = image;
    this._mousePointer = MousePointer.instance;
    this._translateX = 0;
    this._translateY = 0;
    this.width = this._element.getBoundingClientRect().width;
    this.height = this._element.getBoundingClientRect().height;
    this.color = getComputedStyle(this._element).getPropertyValue(
      "background-color"
    );

    this.img = getComputedStyle(this._element)
      .getPropertyValue("background-image")
      .replace(/^url\(["']?/, "")
      .replace(/["']?\)$/, "");

    this.updateProperties();
  }

  update(vel: number) {
    if (Func.instance.sw() < 800) {
      this.update_sp(vel);
    } else {
      this.update_pc(vel);
    }
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

    this.updateProperties();
  }

  update_sp(vel: number) {
    // move item
    this._translateY += -vel;
    if (
      this._element.getBoundingClientRect().y <
      -Func.instance.sw() * 0.46933333 * 1.5
    ) {
      this._translateY += Func.instance.sw() * 0.704 * 6 + 156;
    }
    if (this._element.getBoundingClientRect().y > Func.instance.sh() * 1.4) {
      this._translateY -= Func.instance.sw() * 0.704 * 6 + 156;
    }
    this._element.style.transform = `translate(0, ${this._translateY}px)`;

    this.updateProperties();
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
