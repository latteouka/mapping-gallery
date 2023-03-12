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
varying vec4 v_mv;


float PI = 3.1415926535897932384626433832795;

void main(void) {
  vec2 coord = v_mv.xy / u_resolution;
  float factor = smoothstep(0.0, 1.0, sin(coord.y * PI));

  vec4 color = texture2D(u_texture, v_uv);
  vec4 texture2 = texture2D(u_texture2, v_uv);

  vec4 final = mix(color, texture2, factor);

  // gl_FragColor = vec4(newUv, 0.0, 1.0);
  // gl_FragColor = vec4(length(centeredUV),0.0,  0.0, 1.0);
  // gl_FragColor = vec4(centeredUV, 0.0, 1.0);
  gl_FragColor = final;
}
