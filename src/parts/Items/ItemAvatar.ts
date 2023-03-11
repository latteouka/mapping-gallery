import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item-avatar.vert";
import fragment from "./shaders/item-avatar.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
import { lenis } from "../SmoothScroll";
import { TexLoader } from "../../webgl/texLoader";
import gsap from "gsap";

const imageWidth = 180;
const imageHeight = 180;
const num = imageWidth * imageHeight;

const geometry = new THREE.InstancedBufferGeometry();

export class ItemAvatar extends Item {
  mesh: ItemAvatarMesh;
  protected _element: Image;

  constructor(element: Image) {
    super(element);
    this._element = element;

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: Update.instance.cnt },
        u_random: { value: 1.0 },
        u_depth: { value: 2.0 },
        u_size: { value: 0.0 },
        u_scrollVelocity: { value: 0 },
        u_resolution: {
          value: new THREE.Vector2(Func.instance.sw(), Func.instance.sh()),
        },
        u_textureSize: {
          value: new THREE.Vector2(imageWidth, imageHeight),
        },
        u_texture: {
          value: TexLoader.instance.get("/img/avatar.jpg"),
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
          // value: new THREE.Color(0x51b1f5),
          value: new THREE.Color(0x000),
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

    // positions
    const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
    positions.setXYZ(0, -0.5, 0.5, 0.0);
    positions.setXYZ(1, 0.5, 0.5, 0.0);
    positions.setXYZ(2, -0.5, -0.5, 0.0);
    positions.setXYZ(3, 0.5, -0.5, 0.0);
    geometry.setAttribute("position", positions);

    // uvs
    const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
    uvs.setXY(0, 0.0, 0.0);
    uvs.setXY(1, 1.0, 0.0);
    uvs.setXY(2, 0.0, 1.0);
    uvs.setXY(3, 1.0, 1.0);
    geometry.setAttribute("uv", uvs);

    // index
    geometry.setIndex(
      new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
    );

    const indices = new Uint16Array(num);
    const offsets = new Float32Array(num * 3);
    const angles = new Float32Array(num);

    for (let i = 0; i < num; i++) {
      offsets[i * 3 + 0] = i % imageWidth;
      offsets[i * 3 + 1] = Math.floor(i / imageHeight);

      indices[i] = i;

      angles[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute(
      "pindex",
      new THREE.InstancedBufferAttribute(indices, 1, false)
    );
    geometry.setAttribute(
      "offset",
      new THREE.InstancedBufferAttribute(offsets, 3, false)
    );
    geometry.setAttribute(
      "angle",
      new THREE.InstancedBufferAttribute(angles, 1, false)
    );

    this.mesh = new ItemAvatarMesh(geometry, material, num);
    this.mesh.name = "item-avatar";
    this.add(this.mesh);

    this.mesh.scale.set(
      this._element.width / 150,
      this._element.width / 150,
      1
    );

    this.mesh.rotation.set(0, Math.PI / 12, 0);

    this.position.set(this._element.position.x, this._element.position.y, 0);
    this._setupAnimation();
  }

  private _setupAnimation() {
    const material = this.mesh.material as THREE.ShaderMaterial;
    console.log(material);
    // randomize
    gsap.fromTo(material.uniforms.u_size, { value: 0.01 }, { value: 1.2 });
    gsap.to(material.uniforms.u_random, { value: 2.0 });
    gsap.fromTo(material.uniforms.u_depth, { value: 20.0 }, { value: -4.0 });
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

    material.uniforms.u_time.value = Update.instance.cnt / 100;
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(
      this._element.width / 4,
      this._element.width / 4,
      this._element.width / 4
    );
    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
  }
}

export class ItemAvatarMesh extends THREE.InstancedMesh {
  constructor(
    geo: THREE.BufferGeometry,
    mat: THREE.ShaderMaterial,
    num: number
  ) {
    super(geo, mat, num);
  }

  onHover() {}

  onClick() {}

  onTouchLeave() {}
}
