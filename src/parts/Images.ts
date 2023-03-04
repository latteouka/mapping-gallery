import { Func } from "../core/func";
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
  private _translateY: number;
  width: number;
  height: number;
  color: string;
  img: string;
  position: { x: number; y: number } = { x: 0, y: 0 };

  constructor(image: HTMLElement) {
    this._element = image;
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
    if (
      this._element.getBoundingClientRect().y <
      -Func.instance.sw() * 0.234375 * 0.8
    ) {
      this._translateY += Func.instance.sw() * 0.234375 * 3 + 180;
    }
    if (this._element.getBoundingClientRect().y > Func.instance.sh() * 1.05) {
      this._translateY -= Func.instance.sw() * 0.234375 * 3 + 180;
    }
    this._element.style.transform = `translate(0, ${this._translateY}px)`;

    this.updateProperties();
  }

  update_sp(vel: number) {
    // move item
    this._translateY += -vel;
    if (
      this._element.getBoundingClientRect().y <
      -Func.instance.sw() * 0.46933333 * 1.5
    ) {
      this._translateY += Func.instance.sw() * 0.704 * 4 + 104;
    }
    if (this._element.getBoundingClientRect().y > Func.instance.sh() * 1.4) {
      this._translateY -= Func.instance.sw() * 0.704 * 4 + 104;
    }
    this._element.style.transform = `translate(0, ${this._translateY}px)`;

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
    this._element.style.transform = `translate(0, 0)`;
    this._translateY = 0;
    this.updateProperties();
  }
}
