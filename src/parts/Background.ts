import * as THREE from "three";
import vertex from "./shaders/background.vert";
import fragment from "./shaders/background.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Update } from "../libs/update";
import { Func } from "../core/func";
import { MousePointer } from "../core/mousePointer";
import { TexLoader } from "../webgl/texLoader";
import { lenis } from "./SmoothScroll";

// normal plane
const geometry = new THREE.PlaneGeometry(1, 1);

export class Background extends MyObject3D {
  private _mesh: THREE.Mesh;
  constructor() {
    super();
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
          value: MousePointer.instance.velocityX,
        },
        u_dragVelocityY: {
          value: MousePointer.instance.velocityY,
        },
        u_texture: {
          value: TexLoader.instance.get("/img/back.png"),
        },
      },
    });

    this._mesh = new THREE.Mesh(geometry, material);
    this._mesh.scale.set(Func.instance.sw() * 1.2, Func.instance.sh() * 1.2, 1);
    this.position.set(0, 0, -200);
    this.add(this._mesh);
  }

  protected _update(): void {
    super._update();
    const material = this._mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_dragVelocityX.value = MousePointer.instance.velocityX;
    material.uniforms.u_dragVelocityY.value = MousePointer.instance.velocityY;
    material.uniforms.u_scrollVelocity.value = lenis.velocity;
    material.uniforms.u_time.value = Update.instance.cnt / 1000;
  }

  protected _resize(): void {
    super._resize();
    this._mesh.scale.set(Func.instance.sw() * 1.2, Func.instance.sh() * 1.2, 1);
  }
}
