import * as THREE from "three";
import vertex from "../glsl/item.vert";
import fragment from "../glsl/item.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Update } from "../libs/update";
import { Image } from "./Images";

const geometry = new THREE.PlaneGeometry(1, 1, 30, 30);

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
        uTime: { value: Update.instance.cnt },
      },
      wireframe: true,
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
}
