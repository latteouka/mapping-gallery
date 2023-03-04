import * as THREE from "three";
import vertex from "../glsl/image/image.vert";
import fragment from "../glsl/image/image.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Update } from "../libs/update";
import { Image } from "./Images";
import { Func } from "../core/func";

const geometry = new THREE.PlaneGeometry(1, 1, 64, 64);

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

    this.mesh = new THREE.Mesh(geometry, material);
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
