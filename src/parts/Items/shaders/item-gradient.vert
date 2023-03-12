uniform float u_time;
uniform float u_scrollVelocity;
uniform float u_dragVelocityX;
uniform float u_dragVelocityY;
uniform vec2 u_resolution;
uniform bool u_isPC;
uniform vec3 u_color[5];

varying vec3 v_pos;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec3 v_color;

float PI = 3.1415926535897932384626433832795;

//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main(){
  v_pos = position;
  v_normal = normal;
  v_uv = uv;

  float time = u_time;
  vec3 pos = position;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  //
  // ---
  vec2 noiseCoord = uv * vec2(2.0, 3.0);

  float tilt = uv.y * -0.8;
  float incline = uv.x * 10.0;
  float offset = incline * 0.5 * mix(-0.5, 0.5, uv.y);

  // float noise = snoise(vec3(noiseCoord.x + time * 3.0, noiseCoord.y + time * 10.0, time));
  // noise = max(0.0, noise);

  // if (uv.x > 0.05 && uv.x < 0.95 && uv.y > 0.05 && uv.y < 0.95) {
  //   pos.z += noise * 30.0 + tilt + incline + offset;
  // }

  v_color = vec3(0.6);
  for( int i = 0; i < 5; i++) {
    float noiseFlow = 1.0 + float(i) * 0.3; 
    float noiseSpeed = 2.0 + float(i) * 0.3;
    float noiseSeed = 1.0 + float(i) * 10.0;

    vec2 noiseFreq = vec2(0.3, 0.4);

    float noise = snoise(
        vec3(
          noiseCoord.x * noiseFreq.x + time * noiseFlow,
          noiseCoord.y * noiseFreq.y,
          time * noiseSpeed + noiseSeed
        )
      ) * 0.8;
    v_color = mix(v_color, u_color[i], noise);
  }

  // ---
  //
  vec2 coord = mvPosition.xy / u_resolution;
  vec2 uvCurve = uv;

  float intensity = 0.0;
  float rotateFactor = 0.0;
  float dragIntensity = 0.0;

  if (u_isPC) {
    intensity = 50.0;
    rotateFactor = 10.0;
    dragIntensity = 200.0;
  } else {
    intensity = 120.0;
    rotateFactor = 0.5;
    dragIntensity = 450.0;
  }

  float x = 0.0;
  float y = 0.0;
  float z = 0.0;

  if(u_scrollVelocity > 0.0){
    z += cos((coord.y) * PI) * u_scrollVelocity * -intensity;
  }
  else {
    z += cos((coord.y) * PI) * u_scrollVelocity * intensity;
  }

  x += sin((coord.y)) * u_scrollVelocity / rotateFactor;

  if(u_dragVelocityX > 0.0){
    z += cos((coord.x) * PI) * u_dragVelocityX * -dragIntensity;
  }
  else {
    z += cos((coord.x) * PI) * u_dragVelocityX * dragIntensity;
  }

  x += sin((coord.y)) * u_dragVelocityX / rotateFactor;

  if(u_dragVelocityY > 0.0){
    z += cos((coord.y) * PI) * u_dragVelocityY * -dragIntensity;
  }
  else {
    if(u_isPC) {
      z += cos((coord.y) * PI) * u_dragVelocityY * dragIntensity;
    } else {
      z += cos((coord.y) * PI) * u_dragVelocityY * dragIntensity;
    }
  }

  vec3 curve = vec3(x, y, z);
  pos += curve * 0.03;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
