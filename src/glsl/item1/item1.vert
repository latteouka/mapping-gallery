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
  vec4 final = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vec2 coord = final.xy / u_resolution;

  vec2 uvCurve = uv;


  float intensity = 0.0;
  float rotateFactor = 2.0;

  if (u_isPC) {
    intensity = 0.5;
    rotateFactor = 3.0;
  } else {
    intensity = 0.5;
    rotateFactor = 1.0;
  }

  // slightly rotate the item
  float x = 0.0;
  // float y = cos((uvCurve.x) * PI) * u_scrollVelocity / 50.0;
  float y = 0.0;
  float z = 0.0;


  // scroll
  if(u_scrollVelocity > 0.0){
    z += -cos((coord.y) * PI ) * u_scrollVelocity * -intensity;
  }
  else {
    z += cos((coord.y) * PI) * u_scrollVelocity * intensity;
  }

  // drag x
  if(u_dragVelocityX > 0.0){
    z += cos((coord.x) * PI ) * u_dragVelocityX * -1.0;
  }
  else {
    z += -cos((coord.x) * PI) * u_dragVelocityX * 1.0;
  }

  // drag y
  if(u_dragVelocityY > 0.0){
    z += cos((coord.y) * PI ) * u_dragVelocityY * -intensity;
  }
  else {
    z += -cos((coord.y) * PI) * u_dragVelocityY * intensity;
  }

  vec3 curve = vec3(x, y, z);
  pos += curve * 0.03;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
