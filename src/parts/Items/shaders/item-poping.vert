uniform float u_time;
uniform float u_scrollVelocity;
uniform float u_dragVelocityX;
uniform float u_dragVelocityY;
uniform float u_progress;
uniform float u_direction;
uniform vec2 u_resolution;
uniform bool u_isPC;
uniform vec3 u_color[5];

varying vec3 v_pos;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec3 v_color;

float PI = 3.1415926535897932384626433832795;

void main(){
  v_pos = position;
  v_normal = normal;
  v_uv = uv;

  float time = u_time;
  vec3 pos = position;

  // --------------
  float d = length(uv - vec2(0.5));
  float maxdist = length(vec2(0.5));

  float normalizedDist = d/maxdist;
  float up = 1.0 - normalizedDist;
  float down = normalizedDist;

  // based on distance from center -> circle drag effect
  float effect = mix(up, down, u_direction);

  // stretch range of the animation
  float zIntensity = 3.0;

  // this is for up and down
  float pop = min(2.0*u_progress, 2.0*(1.0 - u_progress));

  // add stop at 1 so the animation will have a stop effect
  float zProgress = mix(
      clamp(2.0*u_progress, 0.0, 1.0),
      clamp(1.0 - 2.0*(1.0-u_progress), 0.0, 1.0),
      u_direction
    );

  // drag part
  pos.z += zIntensity * (effect * 10.0 * pop + u_progress * 10.0) * zProgress;
  // distort animation when still
  pos.z += (1.0 - u_progress) * sin(d* 10.0 + u_time) * 15.0;
  // --------------
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
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