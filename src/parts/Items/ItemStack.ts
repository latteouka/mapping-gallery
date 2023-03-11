import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item-title.vert";
import fragment from "./shaders/item-stack.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
// @ts-ignore
import { MSDFTextGeometry, uniforms } from "three-msdf-text-utils";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { lenis } from "../SmoothScroll";
import { Param } from "../../core/param";

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

export class ItemStack extends Item {
  mesh: ItemStackMesh | null = null;
  mesh2: ItemStackMesh | null = null;
  mesh3: ItemStackMesh | null = null;
  mesh4: ItemStackMesh | null = null;
  mesh5: ItemStackMesh | null = null;
  mesh6: ItemStackMesh | null = null;
  protected _element: Image;

  constructor(element: Image) {
    super(element);
    this._element = element;

    Promise.all([
      loadFontAtlas("/fonts/SauceCodeProNerdFontComplete.png"),
      loadFont("/fonts/Sauce Code Pro Nerd Font Complete-msdf.json"),
    ]).then(([atlas, font]: any) => {
      const geometry = new MSDFTextGeometry({
        text: "- Main Skills -",
        font: font.data,
      });
      const geometry2 = new MSDFTextGeometry({
        text: "Javascript/Node.js",
        font: font.data,
      });
      const geometry3 = new MSDFTextGeometry({
        text: "Typescript",
        font: font.data,
      });
      const geometry4 = new MSDFTextGeometry({
        text: "React.js/Next.js",
        font: font.data,
      });
      const geometry5 = new MSDFTextGeometry({
        text: "Webgl/Shader",
        font: font.data,
      });
      const geometry6 = new MSDFTextGeometry({
        text: "Blender Basics",
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
          u_meshSize: {
            value: new THREE.Vector2(this._element.width, this._element.height),
          },
          u_progress: {
            value: 0,
          },
          uMap: {
            value: null,
          },
        },
        transparent: true,
        opacity: 0.1,
      });

      material.uniforms.uMap.value = atlas;

      this.mesh = new ItemStackMesh(geometry, material);
      this.mesh2 = new ItemStackMesh(geometry2, material);
      this.mesh3 = new ItemStackMesh(geometry3, material);
      this.mesh4 = new ItemStackMesh(geometry4, material);
      this.mesh5 = new ItemStackMesh(geometry5, material);
      this.mesh6 = new ItemStackMesh(geometry6, material);

      this.add(this.mesh);
      this.add(this.mesh2);
      this.add(this.mesh3);
      this.add(this.mesh4);
      this.add(this.mesh5);
      this.add(this.mesh6);

      this.scale.set(
        this._element.width / 350,
        -this._element.width / 350,
        this._element.width / 350
      );

      this.position.set(this._element.position.x, this._element.position.y, 0);
      this.mesh.scale.set(0.9, 0.9, 0.9);
      this.mesh2.scale.set(0.9, 0.9, 0.9);
      this.mesh3.scale.set(0.9, 0.9, 0.9);
      this.mesh4.scale.set(0.9, 0.9, 0.9);
      this.mesh5.scale.set(0.9, 0.9, 0.9);
      this.mesh6.scale.set(0.9, 0.9, 0.9);
      this.mesh.position.set(35, -170, 0);
      this.mesh2.position.set(0, -100, 0);
      this.mesh3.position.set(88, -30, 0);
      this.mesh4.position.set(25, 40, 0);
      this.mesh5.position.set(70, 110, 0);
      this.mesh6.position.set(45, 180, 0);
    });
  }

  protected _update(): void {
    if (!this.mesh) return;
    super._update();

    this.position.set(this._element.position.x, this._element.position.y, 0);

    const material = this.mesh!.material as THREE.ShaderMaterial;

    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;

    material.uniforms.u_progress.value = Param.instance.main.progress.value;
    material.uniforms.u_resolution.value.set(
      Func.instance.sw(),
      Func.instance.sh()
    );

    material.uniforms.u_scrollVelocity.value = lenis.velocity;
    material.uniforms.u_meshSize.value.set(
      this._element.width,
      this._element.height
    );
    // const material2 = this.mesh2!.material as THREE.ShaderMaterial;
    // material2.copy(material);
  }

  protected _resize(): void {
    super._resize();

    this.scale.set(
      this._element.width / 350,
      -this._element.width / 350,
      this._element.width / 350
    );
    const material = this.mesh!.material as THREE.ShaderMaterial;
    material.uniforms.u_isPC.value = Func.instance.sw() > 800;
    // const material2 = this.mesh2!.material as THREE.ShaderMaterial;
    // material2.copy(material);
  }
}

export class ItemStackMesh extends THREE.Mesh {
  constructor(geo: THREE.SphereGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }

  onHover() {}
  onClick() {}
  onTouchLeave() {}
}
