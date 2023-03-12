import * as THREE from "three";
import { Func } from "../core/func";
import { Canvas } from "../webgl/canvas";
import { Object3D } from "three/src/core/Object3D";
import { Update } from "../libs/update";
import { ImageItem } from "./Item";
import { Image } from "./GridItems";
// import Stats from "stats.js";
import { MousePointer } from "../core/mousePointer";
import { ItemGrainSphere } from "./Items/ItemGrainSphere";
import { ItemTitle } from "./Items/ItemTitle";
import { ItemGradient } from "./Items/ItemGradient";
import { ItemRaymarching } from "./Items/ItemRaymarching";
import { ItemStroke } from "./Items/ItemStroke";
import { ItemPoints } from "./Items/ItemPoints";
import { ItemDistort } from "./Items/ItemDistort";
import { Background } from "./Background";
import { ItemChange } from "./Items/ItemChange";
// import gsap from "gsap";

// const scroll = { value: 0 };
export class Visual extends Canvas {
  private _con: Object3D;
  // mesh objects
  private _items: any[] = [];
  // private post: Post;
  // private _stats: Stats;
  private _raycaster: THREE.Raycaster;
  private _hovered: { [key: string]: any } = {};

  private _intersects: any;

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);
    this._raycaster = new THREE.Raycaster();

    // manually start event listeners
    // for loading animation purpose
    MousePointer.instance.setListeners();

    this.generateItems(opt.images);

    const back = new Background();
    this.mainScene.add(back);

    // this._stats = new Stats();
    // document.body.appendChild(this._stats.dom);

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

    window.addEventListener("click", () => {
      this._intersects.forEach((hit: any) => {
        if (hit.object.onClick) hit.object.onClick();
      });
    });
  }

  protected intersect() {
    /// without this vec2 calculation raycasting will be wrong
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = MousePointer.instance.x - rect.left;
    const y = MousePointer.instance.y - rect.top;
    this._raycaster.setFromCamera(
      {
        x: (x / this.el.clientWidth) * 2 - 1,
        y: (y / this.el.clientHeight) * -2 + 1,
      },
      this.cameraPers
    );
    ///

    this._intersects = this._raycaster.intersectObjects(
      this.mainScene.children,
      true
    );

    this._intersects.forEach((hit: any) => {
      if (!this._hovered[hit.object.uuid]) {
        this._hovered[hit.object.uuid] = hit;
      } else {
        if (hit.object.onHover) hit.object.onHover();
      }
    });

    Object.keys(this._hovered).forEach((key) => {
      const hit = this._intersects.find((hit: any) => hit.object.uuid === key);
      if (hit === undefined) {
        const hoveredItem = this._hovered[key];
        // leave
        if (hoveredItem.object.onTouchLeave) hoveredItem.object.onTouchLeave();
        delete this._hovered[key];
      }
    });
  }

  protected generateItems(images: Image[]) {
    if (Func.instance.sw() > 800) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        let item;
        if (i === 9) {
          item = new ItemGrainSphere(image);
        } else if (i === 22) {
          item = new ItemDistort(image);
        } else if (i === 20) {
          item = new ItemGradient(image);
        } else if (i === 19) {
          item = new ItemPoints(image);
        } else if (i === 18) {
          item = new ItemRaymarching(image);
        } else if (i === 21) {
          item = new ItemStroke(image);
        } else if (i === 23) {
          item = new ItemChange(image);
          // } else if (i === 22) {
          //   item = new ItemGradient(image);
        } else if (i === 8) {
          item = new ItemTitle(image);
          // } else if (i === 14) {
          //   item = new ItemStack(image);
        } else {
          item = new ImageItem(image);
        }
        this._items.push(item);
        if (item) this._con.add(item);
      }
    } else {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        let item;
        if (i === 10) {
          item = new ItemGrainSphere(image);
        } else if (i === 9) {
          item = new ItemTitle(image);
        } else if (i === 16) {
          item = new ItemPoints(image);
        } else if (i === 20) {
          item = new ItemChange(image);
        } else if (i === 21) {
          item = new ItemGradient(image);
        } else if (i === 22) {
          item = new ItemStroke(image);
        } else if (i === 23) {
          item = new ItemDistort(image);
        } else {
          item = new ImageItem(image);
        }
        this._items.push(item);
        if (item) this._con.add(item);
      }
    }
    // for (let i = 0; i < this._items.length; i++) {
    //   this._items[i]._resize();
    // }
  }

  protected _update(): void {
    super._update();

    if (this.isNowRenderFrame()) {
      this._render();
    }

    this.intersect();
  }

  private _render(): void {
    // this._stats.begin();
    this.renderer.setClearColor("#000", 1);
    this.renderer.render(this.mainScene, this.cameraPers);
    // this._stats.end();
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

    this.cameraPers.fov = 45;
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();
  }
}
