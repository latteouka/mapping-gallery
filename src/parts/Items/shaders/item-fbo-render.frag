uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;
uniform sampler2D u_texture2;
uniform sampler2D u_mask;

varying vec3 v_pos;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec3 v_color;

float PI = 3.1415926535897932384626433832795;


void main(void) {
  vec2 newUv = v_uv;

  vec4 maskColor = texture2D(u_mask, newUv);

  float strength = maskColor.a * maskColor.r;

  strength *= 2.0;

  strength = min(1.0, strength);

  vec4 color = texture2D(u_texture, newUv + (1.0 - strength) * 0.2);

  gl_FragColor = color * strength;
  // gl_FragColor.a *= maskColor.r;
}
