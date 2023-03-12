import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item-title.vert";
import fragment from "./shaders/item-title.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
// @ts-ignore
import { MSDFTextGeometry, uniforms } from "three-msdf-text-utils";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { lenis } from "../SmoothScroll";
import { Param } from "../../core/param";
import gsap from "gsap";
import { MousePointer } from "../../core/mousePointer";

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

export class ItemTitle extends Item {
  mesh: ItemTitleMesh | null = null;
  mesh2: ItemTitleMesh | null = null;
  // mesh3: ItemIntroMesh | null = null;
  // mesh4: ItemIntroMesh | null = null;
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
      const geometry2 = new MSDFTextGeometry({
        text: "I'm Yi Chun",
        font: font.data,
      });
      // const geometry3 = new MSDFTextGeometry({
      //   text: "I'm looking for a full time",
      //   font: font.data,
      // });
      // const geometry4 = new MSDFTextGeometry({
      //   text: "frontend/webgl job.",
      //   font: font.data,
      // });

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
          u_meshSize: {
            value: new THREE.Vector2(this._element.width, this._element.height),
          },
          u_progress1: {
            value: 0,
          },
          u_progress2: {
            value: 0,
          },
          u_progress3: {
            value: 0,
          },
          u_progress4: {
            value: 0,
          },
          uMap: {
            value: null,
          },
          u_mouse: {
            value: new THREE.Vector2(
              this._mousePointer.normal.x,
              this._mousePointer.normal.y
            ),
          },
        },
        transparent: true,
        opacity: 0.1,
      });

      material.uniforms.uMap.value = atlas;

      this.mesh = new ItemTitleMesh(geometry, material);
      this.mesh2 = new ItemTitleMesh(geometry2, material);
      // this.mesh3 = new ItemTitleMesh(geometry3, material);
      // this.mesh4 = new ItemTitleMesh(geometry4, material);
      this.mesh.name = "item-title-1";
      this.mesh2.name = "item-title-2";
      // this.mesh3.name = "item-title-3";
      // this.mesh4.name = "item-title-4";

      this.add(this.mesh, this.mesh2);

      this.scale.set(
        this._element.width / 150,
        -this._element.width / 150,
        this._element.width / 150
      );

      this.position.set(this._element.position.x, this._element.position.y, 0);
      this.mesh.scale.set(1, 1, 1);
      this.mesh2.scale.set(1, 1, 1);
      // this.mesh3.scale.set(0.4, 0.4, 0.4);
      // this.mesh4.scale.set(0.4, 0.4, 0.4);
      this.mesh.position.set(-60, -20, 0);
      this.mesh2.position.set(-60, 30, 0);
      // this.mesh3.position.set(-50, 80, 0);
      // this.mesh4.position.set(-50, 105, 0);
    });

    setTimeout(() => {
      this.animate();
    }, 2000);
  }

  private animate() {
    // const material = this.mesh!.material as THREE.ShaderMaterial;
    const duration = 1.8;
    const stagger = 0.2;
    const tl = gsap.timeline();
    tl.to(Param.instance.main.progress, {
      value: 1,
      duration,
    });
    tl.to(
      Param.instance.main.progress2,
      {
        value: 1,
        duration,
      },
      stagger
    );
    tl.to(
      Param.instance.main.progress3,
      {
        value: 1,
        duration,
      },
      stagger * 2
    );
    tl.to(
      Param.instance.main.progress4,
      {
        value: 1,
        duration,
      },
      stagger * 3
    );
  }

  protected _update(): void {
    if (!this.mesh) return;
    super._update();

    this.position.set(this._element.position.x, this._element.position.y, 0);

    const material = this.mesh!.material as THREE.ShaderMaterial;

    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;

    material.uniforms.u_progress1.value = Param.instance.main.progress.value;
    material.uniforms.u_progress2.value = Param.instance.main.progress2.value;
    material.uniforms.u_progress3.value = Param.instance.main.progress3.value;
    material.uniforms.u_progress4.value = Param.instance.main.progress4.value;

    material.uniforms.u_resolution.value.set(
      Func.instance.sw(),
      Func.instance.sh()
    );

    material.uniforms.u_scrollVelocity.value = lenis.velocity;
    material.uniforms.u_meshSize.value.set(
      this._element.width,
      this._element.height
    );
    material.uniforms.u_mouse.value.set(
      MousePointer.instance.normal.x,
      MousePointer.instance.normal.y
    );
    // const material2 = this.mesh2!.material as THREE.ShaderMaterial;
    // material2.copy(material);
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(
      this._element.width / 150,
      -this._element.width / 150,
      this._element.width / 150
    );
    const material = this.mesh!.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
    // const material2 = this.mesh2!.material as THREE.ShaderMaterial;
    // material2.copy(material);
  }
}

export class ItemTitleMesh extends THREE.Mesh {
  constructor(geo: THREE.SphereGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }

  onHover() {}
  onClick() {}
  onTouchLeave() {}
}

export class ItemIntroMesh extends THREE.Mesh {
  constructor(geo: THREE.SphereGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }

  onHover() {}
  onClick() {}
  onTouchLeave() {}
}
