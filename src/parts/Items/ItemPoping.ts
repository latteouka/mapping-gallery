import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item-poping.vert";
import fragment from "./shaders/item-poping.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
import { lenis } from "../SmoothScroll";
import { Param } from "../../core/param";
import { TexLoader } from "../../webgl/texLoader";
import gsap from "gsap";

const plane = new THREE.PlaneGeometry(1, 1, 100, 100);

export class ItemPoping extends Item {
  mesh: ItemPopingMesh;
  private _texture1: THREE.Texture;
  private _texture2: THREE.Texture;
  protected _element: Image;

  constructor(element: Image) {
    super(element);
    this._element = element;

    this._texture1 = TexLoader.instance.get("/img/ouka.jpg");
    this._texture2 = TexLoader.instance.get("/img/latte.png");

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: 0 },
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
        u_texture: {
          value: this._texture1,
        },
        u_texture2: {
          value: this._texture2,
        },
        u_progress: {
          value: Param.instance.main.poping_progress.value,
        },
        u_direction: {
          value: Param.instance.main.poping_direction.value,
        },
      },
      transparent: true,
      opacity: 0.1,
    });

    this.mesh = new ItemPopingMesh(plane, material);
    this.mesh.name = "item-gradient";
    this.add(this.mesh);
    this.scale.set(this._element.width, this._element.width, 1);
    this.position.set(this._element.position.x, this._element.position.y, 0);
  }

  protected _update(): void {
    super._update();

    this.position.set(this._element.position.x, this._element.position.y, 0);

    // uniforms update
    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;
    material.uniforms.u_scrollVelocity.value = lenis.velocity;

    material.uniforms.u_time.value = Update.instance.cnt / 100;
    material.uniforms.u_progress.value =
      Param.instance.main.poping_progress.value;
    material.uniforms.u_direction.value =
      Param.instance.main.poping_direction.value;
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(this._element.width, this._element.width, 1);
    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
  }
}

export class ItemPopingMesh extends THREE.Mesh {
  constructor(geo: THREE.PlaneGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }
  onHover() {
    Param.instance.main.poping_direction.value = 0;
    gsap.to(Param.instance.main.poping_progress, {
      value: 1,
      duration: 1.5,
      onComplete: () => {},
    });
  }
  onClick() {}
  onTouchLeave() {
    Param.instance.main.poping_direction.value = 1;
    gsap.to(Param.instance.main.poping_progress, {
      value: 0,
      duration: 1.5,
      onComplete: () => {},
    });
  }
}
