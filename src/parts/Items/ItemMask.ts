import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item-mask.vert";
import fragment from "./shaders/item-mask.frag";
import vertex2 from "./shaders/item-mask2.vert";
import fragment2 from "./shaders/item-mask2.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
import { lenis } from "../SmoothScroll";
import { TexLoader } from "../../webgl/texLoader";

const plane = new THREE.PlaneGeometry(1, 1, 64, 64);

function range(a: number, b: number) {
  let rand = Math.random();
  return a * rand + b * (1 - rand);
}

export class ItemMask extends Item {
  mesh: ItemMaskMesh;
  backgroundMesh: ItemMaskMesh;
  public renderTarget: THREE.WebGLRenderTarget;
  public scene1: THREE.Scene = new THREE.Scene();
  blobs: any[] = [];
  private _texture1: THREE.Texture;
  private _texture2: THREE.Texture;
  private _mask: THREE.Texture;
  private _con: THREE.Object3D = new THREE.Object3D();
  protected _element: Image;

  constructor(element: Image) {
    super(element);
    this._element = element;
    this._texture1 = TexLoader.instance.get("/img/ouka.jpg");
    this._texture2 = TexLoader.instance.get("/img/latte.png");
    this.renderTarget = new THREE.WebGLRenderTarget(512, 512, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    });
    this._mask = TexLoader.instance.get("/img/blob.png");

    const material = new THREE.ShaderMaterial({
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
    });
    const material2 = new THREE.ShaderMaterial({
      vertexShader: vertex2,
      fragmentShader: fragment2,
      uniforms: {
        u_time: { value: 0 },
        u_scrollVelocity: { value: 0 },
        u_resolution: {
          value: new THREE.Vector4(
            Func.instance.sw(),
            Func.instance.sh(),
            1,
            1
          ),
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
      },
      transparent: true,
      depthTest: false,
    });

    // mesh
    this.mesh = new ItemMaskMesh(plane, material);
    this.mesh.name = "item-mask";

    this.backgroundMesh = new ItemMaskMesh(plane, material2);
    this.backgroundMesh.position.set(0, 0, -0.001);

    this.add(this.mesh, this.backgroundMesh);

    this.scale.set(this._element.width, this._element.width, 1);
    this.position.set(this._element.position.x, this._element.position.y, 0);

    this.addBlobs();
  }

  addBlobs() {
    const num = 64;
    const bl = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({
        map: this._mask,
        transparent: true,
        depthTest: false,
      })
    );
    bl.position.set(0, 0, 0.001);
    for (let i = 0; i < num; i++) {
      const b = bl.clone();

      const theta = range(0, Math.PI * 2);
      const radius = range(0.0, 3);
      b.position.x = radius * Math.sin(theta);
      b.position.y = radius * Math.cos(theta);
      b.userData.life = range(-Math.PI * 4, Math.PI * 4);

      this.blobs.push(b);
      this._con.add(b);
    }
    this._con.scale.setScalar(this._element.width);
    this.scene1.add(this._con);
  }
  updateBlobs() {
    this.blobs.forEach((item) => {
      item.userData.life += 0.05;
      item.scale.setScalar(Math.sin(0.3 * item.userData.life));
    });
  }

  protected _update(): void {
    super._update();
    this.updateBlobs();

    this.position.set(this._element.position.x, this._element.position.y, 0);
    this._con.rotation.set(0, 0, Update.instance.elapsed / 3);

    const material = this.mesh.material as THREE.ShaderMaterial;
    const material2 = this.backgroundMesh.material as THREE.ShaderMaterial;
    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;
    material.uniforms.u_scrollVelocity.value = lenis.velocity;

    // fbo
    material.uniforms.u_mask.value = this.renderTarget.texture;

    material2.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material2.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;
    material2.uniforms.u_scrollVelocity.value = lenis.velocity;

    const width = Func.instance.sw();
    const height = Func.instance.sh();
    material2.uniforms.u_resolution.value.set(width, height, width / height, 1);

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
    const material2 = this.backgroundMesh.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
    material2.uniforms.u_isPC.value = Func.instance.sw() > 800;
  }
}

export class ItemMaskMesh extends THREE.Mesh {
  constructor(geo: THREE.PlaneGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }
  onHover() {}
  onClick() {}
  onTouchLeave() {}
}
