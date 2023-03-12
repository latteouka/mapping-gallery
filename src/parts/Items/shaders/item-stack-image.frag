#include ../../../glsl/snoise2d.glsl

uniform vec3 u_color;
uniform vec3 u_lightColor;
uniform vec2 u_velocity;
uniform float u_time;
uniform sampler2D u_texture;
uniform sampler2D u_noiseTexture;
uniform float u_opacity;

varying vec3 v_pos;
varying vec3 v_normal;
varying vec2 v_uv;

float PI = 3.1415926535897932384626433832795;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main(void) {
  vec4 noise = texture2D(u_noiseTexture, v_uv);
  vec2 dis = v_uv + rotate2d(PI / -1.34) * vec2(noise.r, noise.g) * u_velocity.x * 0.02;
  vec3 color = texture2D(u_texture, dis).rgb;

  gl_FragColor = vec4(color, u_opacity);
}
