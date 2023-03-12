#include ../../../glsl/snoise2d.glsl
uniform vec3 u_color[5];
uniform vec2 u_resolution;

varying vec3 v_pos;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec3 v_color;


float PI = 3.1415926535897932384626433832795;

void main(void) {
  gl_FragColor = vec4(v_color, 1.0);
}
