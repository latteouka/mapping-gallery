attribute float pindex;
attribute vec3 offset;
attribute float angle;

uniform float u_time;
uniform float u_random;
uniform float u_depth;
uniform float u_size;
uniform float u_scrollVelocity;
uniform float u_dragVelocityX;
uniform float u_dragVelocityY;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;
uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform bool u_isPC;

uniform vec3 u_lightPos;

varying vec3 v_pos;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec2 v_puv;
varying vec3 v_surfaceToLight;

float PI = 3.1415926535897932384626433832795;

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float random(float n) {
	return fract(sin(n) * 43758.5453123);
}

void main(){
  v_pos = position;
  v_normal = normal;
  v_uv = uv;
  v_puv = offset.xy / u_textureSize;


  // pixel color
	vec4 colA = texture2D(u_texture, v_puv);
	float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

  // displacement
	vec3 displaced = offset;

	// randomise
	displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * u_random;
	float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, u_time * 0.1)));
	displaced.z += rndz * (random(pindex) * 2.0 * u_depth);
  // center
	displaced.xy -= u_textureSize * 0.5;

	// particle size
	float psize = (snoise(vec2(u_time, pindex) * 0.5) + 2.0);
	psize *= max(grey, 0.2);
	psize *= u_size;

  vec4 mvPosition =  modelViewMatrix * vec4(displaced, 1.0);
  mvPosition.xyz += position * psize;
  gl_Position = projectionMatrix * mvPosition;

}
