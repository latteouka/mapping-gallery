uniform float uTime;

varying vec3 vPos;
varying vec2 vUv;

void main(){
  vPos = position;
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
