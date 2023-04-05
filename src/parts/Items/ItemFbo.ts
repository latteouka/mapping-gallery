import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item-fbo-render.vert";
import fragment from "./shaders/item-fbo-render.frag";
import vertexSim from "./shaders/item-fbo-sim.vert";
import fragmentSim from "./shaders/item-fbo-sim.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
import { lenis } from "../SmoothScroll";
import { TexLoader } from "../../webgl/texLoader";
import { Param } from "../../core/param";

const plane = new THREE.PlaneGeometry(1, 1, 64, 64);

export function getRandomSpherePoint() {
  const u = Math.random();
  const v = Math.random();

  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const r = Math.cbrt(Math.random());

  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);

  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);

  const vector = new THREE.Vector3();

  vector.x = r * sinPhi * cosTheta;
  vector.y = r * sinPhi * sinTheta;
  vector.z = r * cosPhi;

  return vector;
}

export class ItemFbo extends Item {
  mesh: ItemFboMesh;
  simMesh: ItemFboMesh;
  public renderTarget: THREE.WebGLRenderTarget;
  public scene1: THREE.Scene = new THREE.Scene();
  private _texture1: THREE.Texture;
  private _texture2: THREE.Texture;
  private _mask: THREE.Texture;
  private _con: THREE.Object3D = new THREE.Object3D();
  private _materialRender: THREE.ShaderMaterial;
  private _materialSim: THREE.ShaderMaterial;
  protected _element: Image;

  constructor(element: Image) {
    super(element);
    this._element = element;
    this._texture1 = TexLoader.instance.get("/img/ouka.jpg");
    this._texture2 = TexLoader.instance.get("/img/latte.png");
    this.renderTarget = new THREE.WebGLRenderTarget(512, 512);
    this._mask = TexLoader.instance.get("/img/blob.png");

    this._materialRender = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: 0 },
        u_scrollVelocity: { value: 0 },
        u_resolution: {
          value: new THREE.Vector2(Func.instance.sw(), Func.instance.sh()),
        },
        u_texture: {
          value: this._texture1,
        },
        u_texture2: {
          value: this._texture2,
        },
        u_mask: {
          value: this.renderTarget.texture,
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
      blending: THREE.AdditiveBlending,
    });

    this._materialSim = new THREE.ShaderMaterial({
      vertexShader: vertexSim,
      fragmentShader: fragmentSim,
      uniforms: {
        u_time: { value: 0 },
        u_scrollVelocity: { value: 0 },
        u_resolution: {
          value: new THREE.Vector2(Func.instance.sw(), Func.instance.sh()),
        },
        u_texture: {
          value: this._texture1,
        },
        u_texture2: {
          value: this._texture2,
        },
        u_mask: {
          value: this._mask,
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
        u_position: {
          value: null,
        },
        u_speed: {
          value: Param.instance.main.fbo_speed.value,
        },
        u_curl: {
          value: Param.instance.main.fbo_curl.value,
        },
      },
    });

    // mesh
    this.mesh = new ItemFboMesh(plane, this._materialRender);
    this.mesh.name = "item-mask";

    this.simMesh = new ItemFboMesh(plane, this._materialSim);

    this.add(this.mesh);
    this.scene1.add(this.simMesh);

    this.scale.set(this._element.width, this._element.width, 1);
    this.position.set(this._element.position.x, this._element.position.y, 0);
  }

  private _initPosition() {
    const width = 512;
    const height = 512;
    const length = width * height;
    const data = new Float32Array(length);
    for (let i = 0; i < length; i += 3) {
      const point = getRandomSpherePoint();
      data[i + 0] = point.x;
      data[i + 1] = point.y;
      data[i + 2] = point.z;
    }

    const positions = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RGBFormat,
      THREE.FloatType
    );
    positions.needsUpdate = true;

    this._materialSim.uniforms.u_positionl.value = positions;
  }

  protected _update(): void {
    super._update();

    this.position.set(this._element.position.x, this._element.position.y, 0);
    this._con.rotation.set(0, 0, Update.instance.elapsed / 3);

    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;
    material.uniforms.u_scrollVelocity.value = lenis.velocity;

    // fbo
    material.uniforms.u_mask.value = this.renderTarget.texture;

    const time = Update.instance.elapsed;
    material.uniforms.u_time.value = time / 3;
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(
      this._element.width,
      this._element.width,
      this._element.width
    );
    const material = this.mesh.material as THREE.ShaderMaterial;
    const material2 = this.simMesh.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
    material2.uniforms.u_isPC.value = Func.instance.sw() > 800;
  }
}

export class ItemFboMesh extends THREE.Mesh {
  constructor(geo: THREE.PlaneGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }
  onHover() {}
  onClick() {}
  onTouchLeave() {}
}
