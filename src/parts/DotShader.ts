const CurveShader = {
  uniforms: {
    tDiffuse: { value: null },
    u_scrollVelocity: { value: 0 },
  },

  vertexShader: /* glsl */ `
    uniform float u_scrollVelocity;
    varying vec2 vUv;

		void main() {
			vUv = uv;
      vec3 pos = position;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

  fragmentShader: /* glsl */ `
    uniform float u_scrollVelocity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
      vec2 uvCurve = vUv;

      if(u_scrollVelocity > 0.0){
        vUv.y = cos(uvCurve.y - 0.5) * u_scrollVelocity * -100.0;
      }
      else {
        vUv.y = cos(uvCurve.y - 0.5) * u_scrollVelocity * 100.0;
      }

			vec4 color = texture2D( tDiffuse, vUv );
			gl_FragColor = color;

		}`,
};

export { CurveShader };
