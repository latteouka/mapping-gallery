import * as THREE from "three";

const EdgeGrayShader = {
  uniforms: {
    tDiffuse: { value: null },
    u_pixelRatio: { value: window.devicePixelRatio },
    u_resolution: {
      value: new THREE.Vector2(),
    },
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;

		void main() {
			vUv = uv;
      vec3 pos = position;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

  fragmentShader: /* glsl */ `
		uniform sampler2D tDiffuse;
    uniform vec2 u_resolution;
    uniform float u_pixelRatio;
		varying vec2 vUv;

		void main() {
			vec4 color = texture2D(tDiffuse, vUv);

      float alpha = color.a;
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

      vec2 uv = gl_FragCoord.xy / u_resolution / u_pixelRatio;

      float center = smoothstep(0.0, 0.1,uv.x)* 
                      smoothstep(0.0, 0.1, 1.0 - uv.x)*
                      smoothstep(0.0, 0.1,uv.y)*
                      smoothstep(0.0, 0.1, 1.0 - uv.y);

      vec4 final = mix(vec4(vec3(gray), alpha), color, center);

      gl_FragColor = final;
      // gl_FragColor = vec4(uv.x, 0.0, 0.0, 1.0);
		}`,
};

export { EdgeGrayShader };
