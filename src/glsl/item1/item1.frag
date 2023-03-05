#include ../snoise2d.glsl

uniform float u_time;
uniform float u_scrollVelocity;
uniform float u_dragVelocityX;
uniform float u_dragVelocityY;
uniform vec3 u_color;
uniform vec3 u_lightColor;

varying vec3 v_pos;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec3 v_surfaceToLight;

float PI = 3.1415926535897932384626433832795;

vec3 light_reflection(vec3 lightColor) {
  // ambient light is just light's color
  vec3 ambient = lightColor;

  // diffuse calculation
  // dot product of surface dir and normal
  // https://webglfundamentals.org/webgl/lessons/webgl-3d-lighting-point.html
  vec3 diffuse = lightColor * dot(v_surfaceToLight, v_normal);
  return (ambient + diffuse);
}


void main(void) {
  float time = u_time * 0.0001;

  vec3 light = light_reflection(u_lightColor);
  vec2 uv = gl_FragCoord.xy / 0.05;

  vec3 noiseColors = vec3(snoise(uv) * 0.5 + 0.5);

  light *= 1.0;

  noiseColors *= pow(light.r, 5.0);

  gl_FragColor.r = max(noiseColors.r, u_color.r);
  gl_FragColor.g = max(noiseColors.g, u_color.g);
  gl_FragColor.b = max(noiseColors.b, u_color.b);
  gl_FragColor.a = 1.0;
}
