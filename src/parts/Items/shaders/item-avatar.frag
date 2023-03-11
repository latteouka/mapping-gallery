#include ../../../glsl/snoise2d.glsl
uniform vec3 u_color;
uniform vec3 u_lightColor;
uniform sampler2D u_texture;

varying vec3 v_pos;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec2 v_puv;
varying vec3 v_surfaceToLight;

float PI = 3.1415926535897932384626433832795;



void main(void) {
  vec4 color = vec4(0.0);
  // pixel color
	vec4 colA = texture2D(u_texture, v_puv);

	// greyscale
	float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;
	vec4 colB = vec4(grey, grey, grey, 1.0);

	// circle
	float border = 0.3;
	float radius = 0.5;
	float dist = radius - distance(v_uv, vec2(0.5));
	float t = smoothstep(0.0, border, dist);

	// final color
	color = colB;
	color.a = t;

  gl_FragColor = colB;
}
