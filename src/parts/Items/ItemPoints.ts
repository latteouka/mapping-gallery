import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item-points.vert";
import fragment from "./shaders/item-points.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
import colors from "nice-color-palettes";
import { Param } from "../../core/param";
import gsap from "gsap";

const geo = new THREE.BufferGeometry();
const sphere = new THREE.SphereGeometry(0.5, 32, 64);
const box = new THREE.BoxGeometry(0.7, 0.7, 0.7);

const color = colors[15].map((item) => new THREE.Color(item));

export class ItemPoints extends Item {
  mesh: ItemPointsMesh;
  protected _element: Image;

  constructor(element: Image) {
    super(element);
    this._element = element;

    const spherePosition = this._sampler(sphere);
    const boxPosition = this._sampler(box);

    geo.setAttribute("position", new THREE.BufferAttribute(spherePosition, 3));
    geo.setAttribute("position2", new THREE.BufferAttribute(boxPosition, 3));

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
        u_color: {
          // value: new THREE.Color(0x51b1f5),
          value: color,
        },
        u_progress: {
          value: 0,
        },
      },
      transparent: true,
      opacity: 0.1,
    });

    this.mesh = new ItemPointsMesh(geo, material);
    this.mesh.name = "item-points";
    this.add(this.mesh);
    this.scale.set(this._element.width, this._element.width, 1);
    this.position.set(this._element.position.x, this._element.position.y, 0);

    this._animation1();
  }

  private _sampler(geo: THREE.BufferGeometry) {
    const num = 3000;
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geo.toNonIndexed(), material);
    const sampler = new MeshSurfaceSampler(mesh).build();

    const pointsPosition = new Float32Array(num * 3);
    for (let i = 0; i < num; i++) {
      const newPosition = new THREE.Vector3();
      const normal = new THREE.Vector3();
      sampler.sample(newPosition, normal);
      pointsPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3);
    }

    return pointsPosition;
  }

  private _animation1() {
    gsap.to(Param.instance.main.point_progress, {
      value: 1,
      delay: 1,
      duration: 4,
      onComplete: () => {
        this._animation2();
      },
    });
  }
  private _animation2() {
    gsap.to(Param.instance.main.point_progress, {
      value: 0,
      delay: 1,
      duration: 4,
      onComplete: () => {
        this._animation1();
      },
    });
  }

  protected _update(): void {
    super._update();

    this.position.set(this._element.position.x, this._element.position.y, 0);

    this.mesh.rotation.set(
      Update.instance.cnt / 200,
      Update.instance.cnt / 300,
      0
    );
    const material = this.mesh.material as THREE.ShaderMaterial;

    material.uniforms.u_time.value =
      Update.instance.cnt * Param.instance.main.gradient_speed.value;

    material.uniforms.u_progress.value =
      Param.instance.main.point_progress.value;
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(this._element.width, this._element.width, 1);
    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
  }
}

export class ItemPointsMesh extends THREE.Points {
  constructor(geo: THREE.BufferGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }

  onHover() {}

  onClick() {}

  onTouchLeave() {}
}
