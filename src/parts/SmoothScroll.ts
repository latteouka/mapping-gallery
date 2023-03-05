import Lenis from "@studio-freight/lenis";
import { Func } from "../core/func";

export const lenis = new Lenis({
  duration: 2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  infinite: true,
  smoothTouch: true,
});

function raf(time: number) {
  if (Func.instance.sw() > 800) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
}

requestAnimationFrame(raf);
