import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item-edge.vert";
import fragment from "./shaders/item-edge.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
import { lenis } from "../SmoothScroll";

const geometry = new THREE.IcosahedronGeometry(0.4);
const pos = geometry.attributes.position.array;
// count of triangles
const count = pos.length / 3;

const barycentricCoords = [];
for (let i = 0; i < count; i++) {
  barycentricCoords.push(0, 0, 1, 0, 1, 0, 1, 0, 0);
}

const array = new Float32Array(barycentricCoords);
geometry.setAttribute("barycentric", new THREE.BufferAttribute(array, 3));

export class ItemEdge extends Item {
  mesh: ItemEdgeMesh;
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
      },
      transparent: true,
      opacity: 0.1,
    });

    // mesh
    this.mesh = new ItemEdgeMesh(geometry, material);
    this.mesh.name = "item-edge";
    this.add(this.mesh);
    this.scale.set(
      this._element.width,
      this._element.width,
      this._element.width
    );
    this.position.set(this._element.position.x, this._element.position.y, 0);
  }

  protected _update(): void {
    super._update();

    this.position.set(this._element.position.x, this._element.position.y, 0);

    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;
    material.uniforms.u_scrollVelocity.value = lenis.velocity;

    const time = Update.instance.elapsed;
    const rotate = time / 3;
    material.uniforms.u_time.value = time / 3;

    this.rotation.set(rotate, rotate, 0);
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(
      this._element.width,
      this._element.width,
      this._element.width
    );
    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
  }
}

export class ItemEdgeMesh extends THREE.Mesh {
  constructor(geo: THREE.OctahedronGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }
  onHover() {}
  onClick() {}
  onTouchLeave() {}
}
