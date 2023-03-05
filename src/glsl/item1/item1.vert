
uniform float u_time;
uniform float u_scrollVelocity;
uniform float u_dragVelocityX;
uniform float u_dragVelocityY;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;
uniform vec2 u_resolution;
uniform bool u_isPC;

varying vec3 v_pos;
varying vec2 v_uv;

float PI = 3.1415926535897932384626433832795;

void main(){
  v_pos = position;
  v_uv = uv;

  vec3 pos = position;
  vec4 mvPosition =  modelViewMatrix * vec4(pos, 1.0);

  vec2 coord = mvPosition.xy / u_resolution;

  vec2 uvCurve = uv;


  float intensity = 0.0;
  float rotateFactor = 0.0;
  float dragIntensity = 0.0;

  if (u_isPC) {
    intensity = 3.0;
    rotateFactor = 10.0;
    dragIntensity = 3.0;
  } else {
    intensity = 3.0;
    rotateFactor = 10.0;
    dragIntensity = 8.0;
  }

  // slightly rotate the item
  float x = 0.0;
  // float y = cos((uvCurve.x) * PI) * u_scrollVelocity / 50.0;
  float y = 0.0;
  float z = 0.0;

  // z += cos((coord.y) * PI) * 100000.0;

  if(u_scrollVelocity > 0.0){
    z += -cos((coord.y) * PI) * u_scrollVelocity * -intensity;
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
    // z += -cos((uvCurve.y) * PI) * u_dragVelocityY * dragIntensity;
    z += cos((coord.y) * PI) * u_dragVelocityY * -dragIntensity;
  }
  else {
    // z += cos((uvCurve.y) * PI) * u_dragVelocityY * dragIntensity;
    if(u_isPC) {
      z += -cos((coord.y) * PI) * u_dragVelocityY * dragIntensity;
    } else {
      z += cos((coord.y) * PI) * u_dragVelocityY * dragIntensity;
    }
  }

  vec3 curve = vec3(x, y, z);
  pos += curve * 0.03;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
