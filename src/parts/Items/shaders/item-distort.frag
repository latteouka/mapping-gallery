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

  // newUv = v_uv + 0.1 * vec2(sin(10.0 * v_uv.x), sin(10.0 * v_uv.y));

  vec2 centeredUV = 2.0 * v_uv - vec2(1.0);

  for(int i = 1; i < 5; i++) {
    centeredUV.x += 0.1 * float(i) * sin(float(i) * 1.2 * centeredUV.y + float(i) * u_time / 3.0);
    centeredUV.y += 0.15 * float(i) * cos(float(i) * 1.2 * centeredUV.x + float(i) * u_time / 3.0);
  }
  centeredUV += 0.1 * cos(2.0 * centeredUV.yx + u_time);

  newUv.x = mix(newUv.x,1.0 - length(centeredUV), u_progress);
  newUv.y = mix(newUv.y, 0.0, u_progress);

  vec4 color = texture2D(u_texture, newUv);
  vec4 texture2 = texture2D(u_texture2, newUv);

  vec4 final = mix(color, texture2, u_tprogress);

  // gl_FragColor = vec4(newUv, 0.0, 1.0);
  // gl_FragColor = vec4(length(centeredUV),0.0,  0.0, 1.0);
  // gl_FragColor = vec4(centeredUV, 0.0, 1.0);
  gl_FragColor = final;
}
