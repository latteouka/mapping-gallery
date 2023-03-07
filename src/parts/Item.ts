import * as THREE from "three";
import vertex from "../glsl/image/image.vert";
import fragment from "../glsl/image/image.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Update } from "../libs/update";
import { Grid, Image } from "./GridItems";
import { Func } from "../core/func";
import { MousePointer } from "../core/mousePointer";
import { lenis } from "./SmoothScroll";

// normal plane
const geometry = new THREE.PlaneGeometry(1, 1, 64, 64);

// create an plane with border radius
const roundedRectShape = new THREE.Shape();
(function roundedRect(ctx, x, y, width, height, radius) {
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
})(roundedRectShape, 0, 0, 1, 1, 0.05);
const geometry2 = new THREE.ShapeGeometry(roundedRectShape);
// must do this
geometry2.center();

const noises = [
  "/img/water.png",
  "/img/cloudnoise.webp",
  "/img/noise.webp",
  "/img/noise2.jpeg",
  "/img/noise3.jpeg",
];

export class Item extends MyObject3D {
  protected _element: Grid | Image;
  protected _mousePointer: MousePointer;
  constructor(element: Grid) {
    super();
    this._element = element;
    this._mousePointer = MousePointer.instance;
  }

  protected _update(): void {
    super._update();
    // prevent click when drag
    if (this._mousePointer.isDragging) {
      this._element.element.classList.add("disable");
    } else {
      this._element.element.classList.remove("disable");
    }
  }

  protected _resize(): void {
    super._resize();

    this.position.set(this._element.position.x, this._element.position.y, 0);
  }
}

export class ImageItem extends Item {
  mesh: THREE.Mesh;
  protected _element: Image;

  constructor(element: Image) {
    super(element);
    this._element = element;

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: Update.instance.cnt },
        u_scrollVelocity: { value: 0 },
        u_imageTexture: {
          value: new THREE.TextureLoader().load(this._element.img),
        },
        u_noiseTexture: {
          // value: new THREE.TextureLoader().load("/img/cloudnoise.webp"),
          value: new THREE.TextureLoader().load(noises[2]),
        },
        u_meshSize: {
          value: new THREE.Vector2(this._element.width, this._element.height),
        },
        u_textureSize: {
          value: new THREE.Vector2(400, 600),
        },
        u_resolution: {
          value: new THREE.Vector2(Func.instance.sw(), Func.instance.sh()),
        },
        u_isPC: {
          value: Func.instance.sw() > 800,
        },
        u_dragVelocityX: {
          value: this._mousePointer.velocityX,
        },
        u_dragVelocityY: {
          value: this._mousePointer.velocityY,
        },
      },
      transparent: true,
      opacity: 0.1,
    });

    this.mesh = new THREE.Mesh(geometry, material);

    this.add(this.mesh);
    this.scale.set(this._element.width, this._element.height, 1);
    this.position.set(this._element.position.x, this._element.position.y, 0);

    this._update();
    this._resize();
  }
  protected _update(): void {
    super._update();
    this.scale.set(this._element.width, this._element.height, 1);
    this.position.set(this._element.position.x, this._element.position.y, 0);

    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;
    material.uniforms.u_scrollVelocity.value = lenis.velocity;
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(this._element.width, this._element.height, 1);
    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
  }
}
