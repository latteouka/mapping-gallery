uniform float u_Time;

varying vec3 vPos;
varying vec2 vUv;

void main(void) {
  float time = u_Time * 0.0001;

  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
