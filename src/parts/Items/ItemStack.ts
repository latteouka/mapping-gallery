import * as THREE from "three";
import { Item } from "../Item";
import { Image } from "../GridItems";
import vertex from "./shaders/item-title.vert";
import fragment from "./shaders/item-stack.frag";
import imageVertex from "./shaders/item-stack-image.vert";
import imageFragment from "./shaders/item-stack-image.frag";
import { Update } from "../../libs/update";
import { Func } from "../../core/func";
// @ts-ignore
import { MSDFTextGeometry, uniforms } from "three-msdf-text-utils";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { lenis } from "../SmoothScroll";
import { Param } from "../../core/param";
import { TexLoader } from "../../webgl/texLoader";

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

const imageGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);

export class ItemStack extends Item {
  mesh: ItemStackMesh | null = null;
  mesh2: ItemStackMesh | null = null;
  mesh3: ItemStackMesh | null = null;
  mesh4: ItemStackMesh | null = null;
  mesh5: ItemStackMesh | null = null;
  mesh6: ItemStackMesh | null = null;
  image: ItemStackImageMesh | null = null;
  texture1: THREE.Texture;
  texture2: THREE.Texture;
  texture3: THREE.Texture;
  texture4: THREE.Texture;
  private _title1: HTMLElement;
  private _title2: HTMLElement;
  private _title3: HTMLElement;
  private _title4: HTMLElement;
  private _title5: HTMLElement;
  private _title6: HTMLElement;
  protected _element: Image;

  constructor(element: Image) {
    super(element);
    this._element = element;

    const titles = document.querySelectorAll(".stack-title");
    this._title1 = titles[0] as HTMLElement;
    this._title2 = titles[1] as HTMLElement;
    this._title3 = titles[2] as HTMLElement;
    this._title4 = titles[3] as HTMLElement;
    this._title5 = titles[4] as HTMLElement;
    this._title6 = titles[5] as HTMLElement;

    this.texture1 = TexLoader.instance.get("/img/stacks/js.png");
    this.texture2 = TexLoader.instance.get("/img/stacks/ts.png");
    this.texture3 = TexLoader.instance.get("/img/stacks/react.png");
    this.texture4 = TexLoader.instance.get("/img/stacks/blender.png");

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
      });

      const imageMaterial = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: imageVertex,
        fragmentShader: imageFragment,
        uniforms: {
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
          u_progress: {
            value: 0,
          },
          uMap: {
            value: null,
          },
          u_texture: {
            value: null,
          },
          u_noiseTexture: {
            value: TexLoader.instance.get("/img/noise.webp"),
          },
          u_opacity: {
            value: 0,
          },
          u_velocity: {
            value: new THREE.Vector2(
              this._mousePointer.velocityAlways.x,
              this._mousePointer.velocityAlways.y
            ),
          },
        },
        transparent: true,
      });

      material.uniforms.uMap.value = atlas;

      this.mesh = new ItemStackMesh(geometry, material);
      this.mesh2 = new ItemStackMesh(geometry2, material);
      this.mesh2.name = "item-js";
      this.mesh3 = new ItemStackMesh(geometry3, material);
      this.mesh3.name = "item-ts";
      this.mesh4 = new ItemStackMesh(geometry4, material);
      this.mesh4.name = "item-react";
      this.mesh5 = new ItemStackMesh(geometry5, material);
      this.mesh6 = new ItemStackMesh(geometry6, material);
      this.mesh6.name = "item-blender";
      this.image = new ItemStackImageMesh(imageGeometry, imageMaterial);
      this.image.scale.set(150, 150, 1);
      this.image.rotation.set(Math.PI, 0, 0);

      this.add(
        this.mesh,
        this.mesh2,
        this.mesh3,
        this.mesh4,
        this.mesh5,
        this.mesh6,
        this.image
      );

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

  private _setupListener() {}

  private _updatePositions() {}

  protected _update(): void {
    if (!this.mesh) return;
    super._update();

    this.position.set(this._element.position.x, this._element.position.y, 0);

    const material = this.mesh!.material as THREE.ShaderMaterial;
    const imageMaterial = this.image!.material as THREE.ShaderMaterial;

    material.uniforms.u_dragVelocityX.value = this._mousePointer.velocityX;
    material.uniforms.u_dragVelocityY.value = this._mousePointer.velocityY;

    material.uniforms.u_progress.value = Param.instance.main.progress.value;
    material.uniforms.u_resolution.value.set(
      Func.instance.sw(),
      Func.instance.sh()
    );

    material.uniforms.u_scrollVelocity.value = lenis.velocity;

    imageMaterial.uniforms.u_velocity.value.set(
      this._mousePointer.velocityAlways.x,
      this._mousePointer.velocityAlways.y
    );
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
  constructor(geo: MSDFTextGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }

  onHover() {}
  onClick() {}
  onTouchLeave() {}
}

export class ItemStackImageMesh extends THREE.Mesh {
  constructor(geo: THREE.PlaneGeometry, mat: THREE.ShaderMaterial) {
    super(geo, mat);
  }
  onHover() {}
  onClick() {}
  onTouchLeave() {}
}
