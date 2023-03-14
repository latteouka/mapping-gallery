#include ../../../glsl/snoise2d.glsl
uniform vec3 u_color[5];
uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform sampler2D u_texture2;
uniform float u_time;
uniform float u_progress;
uniform float u_tprogress;

varying vec3 v_pos;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec3 v_color;


float PI = 3.1415926535897932384626433832795;

void main(void) {
  vec2 newUv = v_uv;

  vec4 color = texture2D(u_texture, v_uv);

  gl_FragColor = color;
}
