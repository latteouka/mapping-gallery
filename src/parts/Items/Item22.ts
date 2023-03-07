import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item22.vert";
import fragment from "./shaders/item22.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
import { lenis } from "../SmoothScroll";

const sphere = new THREE.SphereGeometry(1, 32, 64);

export class Item22 extends Item {
  mesh: Item22Mesh;
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
        u_color: {
          value: new THREE.Color(0x51b1f5),
        },
        u_lightColor: {
          value: new THREE.Color(0xffffff),
        },
        u_lightPos: {
          value: new THREE.Vector3(
            this._mousePointer.lerpOld.x,
            this._mousePointer.lerpOld.y,
            500
          ),
        },
      },
      transparent: true,
      opacity: 0.1,
    });

    this.mesh = new Item22Mesh(sphere, material);
    this.mesh.name = "item22";
    this.add(this.mesh);
    this.scale.set(
      this._element.width / 3,
      this._element.width / 3,
      this._element.width / 3
    );
    this.position.set(this._element.position.x, this._element.position.y, 0);
  }

  protected _update(): void {
    super._update();

    this.position.set(this._element.position.x, this._element.position.y, 0);

    const material = this.mesh.material as THREE.ShaderMaterial;

    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;

    material.uniforms.u_lightPos.value.set(
      this._mousePointer.x - Func.instance.sw() / 2,
      -this._mousePointer.y + Func.instance.sh() / 2,
      400
    );
    material.uniforms.u_scrollVelocity.value = lenis.velocity;
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(
      this._element.width / 2,
      this._element.width / 2,
      this._element.width / 2
    );
    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
  }
}

// item22 scale
const originWidth = 1.0;
const scaleOrigin = new THREE.Vector3(originWidth, originWidth, originWidth);
const scaleWidth = 1.2;
const scaleTarget = new THREE.Vector3(scaleWidth, scaleWidth, scaleWidth);

export class Item22Mesh extends THREE.Mesh {
  constructor(geo: THREE.SphereGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }

  onHover() {
    const lerp = this.scale.lerp(scaleTarget, 0.05);
    this.scale.set(lerp.x, lerp.y, lerp.z);
  }

  onTouchLeave() {
    const lerp = this.scale.lerp(scaleOrigin, 0.05);
    this.scale.set(lerp.x, lerp.y, lerp.z);
  }
}
