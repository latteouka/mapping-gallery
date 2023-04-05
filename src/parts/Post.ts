import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { Func } from "../core/func";
import { MousePointer } from "../core/mousePointer";
import { Resize } from "../libs/resize";
import { Update } from "../libs/update";
import { EdgeGrayShader } from "./PostShader";
import { FXAAShader } from "./FxaaShader";

export class Post {
  effectComposer: EffectComposer;
  effect1: ShaderPass;
  lerpSpeed: number = 0;

  _updateHandler: any;
  _resizeHandler: any;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) {
    this.effectComposer = new EffectComposer(renderer);
    this.effectComposer.addPass(new RenderPass(scene, camera));

    this.effect1 = new ShaderPass(EdgeGrayShader);
    this.effectComposer.addPass(this.effect1);

    const fxaa = new ShaderPass(FXAAShader);
    this.effectComposer.addPass(fxaa);

    this._updateHandler = this._update.bind(this);
    Update.instance.add(this._updateHandler);
    this._resizeHandler = this._resize.bind(this);
    Resize.instance.add(this._resizeHandler);
  }

  private _update() {
    const width = Func.instance.sw();
    const height = Func.instance.sh();
    this.effect1.uniforms.u_resolution.value.set(
      width,
      height,
      width / height,
      1
    );

    this.effect1.uniforms.u_mouse.value.set(
      (MousePointer.instance.normal.x + 1) / 2,
      (-MousePointer.instance.normal.y + 1) / 2
    );
    const speed = MousePointer.instance.dist / 300;
    this.lerpSpeed += (speed - this.lerpSpeed) * 0.05;
    this.effect1.uniforms.u_speed.value = this.lerpSpeed;
  }

  private _resize() {
    let pixelRatio: number = window.devicePixelRatio || 1;
    this.effect1.uniforms.u_pixelRatio.value = pixelRatio;
  }
}
