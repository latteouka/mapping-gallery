import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item-raymarching.vert";
import fragment from "./shaders/item-raymarching.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
import { lenis } from "../SmoothScroll";
import { TexLoader } from "../../webgl/texLoader";

const plane = new THREE.PlaneGeometry(1, 1);

export class ItemRaymarching extends Item {
  mesh: ItemRaymarchingMesh;
  protected _element: Image;

  constructor(element: Image) {
    super(element);
    this._element = element;

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: 0 },
        u_scrollVelocity: { value: 0 },
        u_resolution: {
          value: new THREE.Vector4(
            Func.instance.sw(),
            Func.instance.sh(),
            1,
            Func.instance.sh() / Func.instance.sw()
          ),
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
        u_texture: {
          value: TexLoader.instance.get("/img/raymarching.png"),
        },
      },
      transparent: true,
      opacity: 0.1,
    });

    this.mesh = new ItemRaymarchingMesh(plane, material);
    this.mesh.name = "item-gradient";
    this.add(this.mesh);
    this.scale.set(this._element.width, this._element.height, 1);
    this.position.set(this._element.position.x, this._element.position.y, 0);
  }

  protected _update(): void {
    super._update();

    this.position.set(this._element.position.x, this._element.position.y, 0);

    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;
    material.uniforms.u_scrollVelocity.value = lenis.velocity;
    material.uniforms.u_time.value = Update.instance.cnt / 100;
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(this._element.width, this._element.width, 1);
    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
  }
}

export class ItemRaymarchingMesh extends THREE.Mesh {
  constructor(geo: THREE.PlaneGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }

  onHover() {}

  onClick() {}

  onTouchLeave() {}
}
