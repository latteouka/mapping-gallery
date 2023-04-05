import * as THREE from "three";

const EdgeGrayShader = {
  uniforms: {
    tDiffuse: { value: null },
    u_pixelRatio: { value: window.devicePixelRatio },
    u_resolution: {
      value: new THREE.Vector4(),
    },
    u_mouse: {
      value: new THREE.Vector2(),
    },
    u_speed: {
      value: 0,
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
    uniform vec4 u_resolution;
    uniform float u_pixelRatio;
    uniform float u_speed;
    uniform vec2 u_mouse;
    
		varying vec2 vUv;

		void main() {
      vec2 adjustUv = (vUv - vec2(0.5))* u_resolution.zw + vec2(0.5); 
      vec2 adjustMouse = (u_mouse - vec2(0.5))* u_resolution.zw + vec2(0.5); 
      
      float mouseDistance = length(adjustUv - adjustMouse);

      float smoothMouse = smoothstep(0.1, 0.0, mouseDistance);

			vec4 color = texture2D(tDiffuse, vUv);

      float alpha = color.a;
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

      vec2 uv = gl_FragCoord.xy / u_resolution.xy / u_pixelRatio;

      float edge = smoothstep(0.0, 0.2,uv.x)* 
                      smoothstep(0.0, 0.2, 1.0 - uv.x);

      float r = texture2D(tDiffuse, vUv + 0.03 * smoothMouse * u_speed).r;
      float g = texture2D(tDiffuse, vUv + 0.02 * smoothMouse * u_speed).g;
      float b = texture2D(tDiffuse, vUv + 0.03 * smoothMouse * u_speed).b;

      vec3 mouseColor = vec3(r, g, b);

      vec4 final = mix(vec4(vec3(gray), alpha), vec4(mouseColor, 1.0), edge);

      gl_FragColor = final;
      // gl_FragColor = vec4(uv.x, 0.0, 0.0, 1.0);
      // gl_FragColor = vec4(r,g,b, 1.0);
		}`,
};

export { EdgeGrayShader };
