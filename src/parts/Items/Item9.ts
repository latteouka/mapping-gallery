import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item9.vert";
import fragment from "./shaders/item9.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
// @ts-ignore
import { MSDFTextGeometry, uniforms } from "three-msdf-text-utils";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { lenis } from "../SmoothScroll";

function loadFontAtlas(path: string) {
  const promise = new Promise((resolve, _reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(path, resolve);
  });

  return promise;
}

function loadFont(path: string) {
  const promise = new Promise((resolve, _reject) => {
    const loader = new FontLoader();
    loader.load(path, resolve);
  });

  return promise;
}

export class Item9 extends Item {
  mesh: Item9Mesh | null = null;
  protected _element: Image;

  constructor(element: Image) {
    super(element);
    this._element = element;

    Promise.all([
      loadFontAtlas("/fonts/SauceCodeProNerdFontComplete.png"),
      loadFont("/fonts/Sauce Code Pro Nerd Font Complete-msdf.json"),
    ]).then(([atlas, font]: any) => {
      const geometry = new MSDFTextGeometry({
        text: "Hello",
        font: font.data,
      });

      const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        defines: {
          IS_SMALL: false,
        },
        extensions: {
          derivatives: true,
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          // Common
          ...uniforms.common,

          // Rendering
          ...uniforms.rendering,

          // Strokes
          ...uniforms.strokes,
          u_time: { value: Update.instance.cnt },
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
            value: new THREE.Color(0x51b1f5),
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
          uMap: {
            value: null,
          },
        },
        transparent: true,
        opacity: 0.1,
      });

      material.uniforms.uMap.value = atlas;

      this.mesh = new Item9Mesh(geometry, material);
      this.mesh.name = "item9";
      console.log(this.mesh);

      this.add(this.mesh);

      this.scale.set(
        this._element.width / 150,
        -this._element.width / 150,
        this._element.width / 150
      );

      this.position.set(this._element.position.x, this._element.position.y, 0);
      this.mesh.position.set(-63, -30, 0);
    });
  }

  protected _update(): void {
    if (!this.mesh) return;
    super._update();

    this.position.set(this._element.position.x, this._element.position.y, 0);

    const material = this.mesh!.material as THREE.ShaderMaterial;

    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;

    material.uniforms.u_resolution.value.set(
      Func.instance.sw(),
      Func.instance.sh()
    );

    material.uniforms.u_lightPos.value.set(
      this._mousePointer.x - Func.instance.sw() / 2,
      -this._mousePointer.y + Func.instance.sh() / 2,
      400
    );
    material.uniforms.u_scrollVelocity.value = lenis.velocity;
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(
      this._element.width / 2,
      this._element.width / 2,
      this._element.width / 2
    );
    const material = this.mesh!.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
  }
}

export class Item9Mesh extends THREE.Mesh {
  constructor(geo: THREE.SphereGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }

  onHover() {}

  onTouchLeave() {}
}
