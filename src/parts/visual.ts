import { Func } from "../core/func";
import { Canvas } from "../webgl/canvas";
import { Object3D } from "three/src/core/Object3D";
import { Update } from "../libs/update";
import { Item } from "./Item";
import { lenis } from "./SmoothScroll";
import { Image } from "./Images";
// import gsap from "gsap";

// const scroll = { value: 0 };
export class Visual extends Canvas {
  private _con: Object3D;
  // mesh objects
  private _items: Item[] = [];
  // private post: Post;

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    this.generateItemsPc(opt.images);

    lenis.on("scroll", ({ velocity }: any) => {
      for (let i = 0; i < this._items.length; i++) {
        this._items[i].updateScroll(velocity);
      }
    });

    // gsap.to(scroll, {
    //   value: () => Func.instance.sw() * 10,
    //   duration: 3,
    //   ease: "strong.inOut",
    //   onUpdate: () => {
    //     const s = gsap.getProperty(scroll, "value");
    //     console.log(s);
    //     lenis.scrollTo(s);
    //   },
    // });

    // this.post = new Post(this.renderer, this.mainScene, this.cameraPers);

    this._resize();
  }

  protected generateItemsPc(images: Image[]) {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const item = new Item(image);
      this._items.push(item);
      this._con.add(item.mesh);
    }
  }

  protected _update(): void {
    super._update();

    if (this.isNowRenderFrame()) {
      this._render();
    }
  }

  private _render(): void {
    this.renderer.setClearColor("#fff", 0);
    this.renderer.render(this.mainScene, this.cameraPers);
  }

  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0;
  }

  _resize(): void {
    super._resize();
    // this.post.resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);

    this.cameraPers.fov = 90;
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();
  }
}
