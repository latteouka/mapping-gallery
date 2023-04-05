uniform vec4 u_resolution;
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
  // vec2 adjustUv = (v_uv - vec2(0.5))* u_resolution.zw + vec2(0.5); 

  vec4 color = texture2D(u_texture2, newUv);

  gl_FragColor = color;
}
