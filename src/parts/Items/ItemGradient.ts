import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item-gradient.vert";
import fragment from "./shaders/item-gradient.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
import { lenis } from "../SmoothScroll";
import colors from "nice-color-palettes";
import { Param } from "../../core/param";
import { Util } from "../../libs/util";

const sphere = new THREE.SphereGeometry(0.5, 32, 64);

// create an plane with border radius
const roundedRectShape = new THREE.Shape();
(function roundedRect(ctx, x, y, width, height, radius) {
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
})(roundedRectShape, 0, 0, 1, 1, 0.1);
const geometry2 = new THREE.ShapeGeometry(roundedRectShape);
// must do this
geometry2.center();

const color = colors[15].map((item) => new THREE.Color(item));

export class ItemGradient extends Item {
  mesh: ItemGradientMesh;
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
        u_color: {
          // value: new THREE.Color(0x51b1f5),
          value: color,
        },
      },
      transparent: true,
      opacity: 0.1,
    });

    this.mesh = new ItemGradientMesh(sphere, material);
    this.mesh.name = "item-gradient";
    this.add(this.mesh);
    this.scale.set(this._element.width, this._element.width, 1);
    this.position.set(this._element.position.x, this._element.position.y, 0);
  }

  protected _update(): void {
    super._update();

    this.position.set(this._element.position.x, this._element.position.y, 0);

    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;
    material.uniforms.u_scrollVelocity.value = lenis.velocity;

    material.uniforms.u_time.value =
      Update.instance.cnt * Param.instance.main.gradient_speed.value;
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(this._element.width, this._element.width, 1);
    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
  }
}

export class ItemGradientMesh extends THREE.Mesh {
  constructor(geo: THREE.SphereGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }

  onHover() {
    Param.instance.main.gradient_speed.value = 0.003;
  }

  onClick() {}

  onTouchLeave() {
    Param.instance.main.gradient_speed.value = 0.0015;
  }
}
