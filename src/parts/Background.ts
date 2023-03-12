import * as THREE from "three";
import vertex from "./shaders/background.vert";
import fragment from "./shaders/background.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Update } from "../libs/update";
import { Func } from "../core/func";
import { TexLoader } from "../webgl/texLoader";

// normal plane
const geometry = new THREE.PlaneGeometry(1, 1);

export class Background extends MyObject3D {
  mesh: THREE.Mesh;
  constructor() {
    super();
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: Update.instance.cnt },
        u_isPC: {
          value: Func.instance.sw() > 800,
        },
        u_texture: {
          value: TexLoader.instance.get("/img/back.png"),
        },
      },
      depthTest: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.scale.set(Func.instance.sw() * 1.2, Func.instance.sh() * 1.2, 1);
    this.position.set(0, 0, -200);
    this.add(this.mesh);
  }

  protected _update(): void {
    super._update();
    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_time.value = Update.instance.cnt / 1000;
  }

  protected _resize(): void {
    super._resize();
    this.mesh.scale.set(Func.instance.sw() * 1.2, Func.instance.sh() * 1.2, 1);
  }
}
