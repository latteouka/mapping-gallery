import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { EdgeGrayShader } from "./PostShader";

export class Post {
  effectComposer: EffectComposer;
  effect1: ShaderPass;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) {
    this.effectComposer = new EffectComposer(renderer);
    this.effectComposer.addPass(new RenderPass(scene, camera));

    this.effect1 = new ShaderPass(EdgeGrayShader);
    this.effectComposer.addPass(this.effect1);
  }
}
