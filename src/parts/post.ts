import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { Func } from "../core/func";
import { CurveShader } from "./DotShader";
import { lenis } from "./SmoothScroll";

export class Post {
  composer: EffectComposer;
  effectPass: ShaderPass;
  constructor(renderer, scene, camera) {
    this.composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);

    this.composer.setSize(Func.instance.sw(), Func.instance.sh());
    this.composer.addPass(renderPass);
    this.effectPass = new ShaderPass(CurveShader);
    this.composer.addPass(this.effectPass);

    lenis.on("scroll", ({ velocity }: any) => {
      this.effectPass.uniforms.u_scrollVelocity.value = velocity;
    });
  }

  update() {
    this.composer.render();
  }

  resize() {
    this.composer.setSize(Func.instance.sw(), Func.instance.sh());
  }
}
