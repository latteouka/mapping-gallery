import * as THREE from "three";
import vertex from "../glsl/image/image.vert";
import fragment from "../glsl/image/image.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Update } from "../libs/update";
import { Image } from "./Images";
import { Func } from "../core/func";

// normal plane
// const geometry = new THREE.PlaneGeometry(1, 1, 64, 64);

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

const noises = [
  "/img/water.png",
  "/img/cloudnoise.webp",
  "/img/noise.webp",
  "/img/noise2.jpeg",
  "/img/noise3.jpeg",
];

export class Item extends MyObject3D {
  mesh: THREE.Mesh;
  private _element: Image;
  constructor(element: Image) {
    super();

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
      },
    });

    this.mesh = new THREE.Mesh(geometry2, material);
    this.mesh.scale.set(this._element.width, this._element.height, 1);
    this.mesh.position.set(
      this._element.position.x,
      this._element.position.y,
      0
    );
  }

  protected _update(): void {
    super._update();

    this.mesh.scale.set(this._element.width, this._element.height, 1);
    this.mesh.position.set(
      this._element.position.x,
      this._element.position.y,
      0
    );
  }

  protected _resize(): void {
    super._resize();
    this.mesh.scale.set(this._element.width, this._element.height, 1);
    this.mesh.position.set(
      this._element.position.x,
      this._element.position.y,
      0
    );
  }

  updateScroll(vel: number) {
    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_scrollVelocity.value = vel;
  }
}
