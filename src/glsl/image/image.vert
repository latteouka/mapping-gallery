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

  // this is for full screen distort
  vec2 coord = mvPosition.xy / u_resolution;
  // this is for element distort
  vec2 uvCurve = uv;

  float intensity = 0.0;
  float rotateFactor = 0.0;
  float dragIntensity = 0.0;

  if (u_isPC) {
    intensity = 30.0;
    rotateFactor = 10.0;
    dragIntensity = 100.0;
  } else {
    intensity = 100.0;
    rotateFactor = 0.5;
    dragIntensity = 100.0;
  }

  float x = 0.0;
  float y = 0.0;
  float z = 0.0;


  // -----------
  // full screen coord based distort(scroll)
  // -----------
  if(u_scrollVelocity > 0.0){
    z += cos((coord.y) * PI) * u_scrollVelocity * -intensity;
  }
  else {
    z += cos((coord.y) * PI) * u_scrollVelocity * intensity;
  }

  // slightly rotateって感じ
  x += sin((coord.y)) * u_scrollVelocity / rotateFactor;

  // -----------
  // full screen coord based distort(drag x and y)
  // -----------
  if(u_dragVelocityX > 0.0){
    x += -sin((coord.y)) * u_dragVelocityX / -rotateFactor;
    z += cos((coord.x) * PI) * u_dragVelocityX * -dragIntensity;
  }
  else {
    x += sin((coord.y)) * u_dragVelocityX / rotateFactor;
    z += cos((coord.x) * PI) * u_dragVelocityX * dragIntensity;
  }


  if(u_dragVelocityY > 0.0){
    z += cos((coord.y) * PI) * u_dragVelocityY * -dragIntensity;
  }
  else {
    if(u_isPC) {
      z += cos((coord.y) * PI) * u_dragVelocityY * dragIntensity;
    } else {
      // only ball effect on sp
      z += cos((coord.y) * PI) * u_dragVelocityY * dragIntensity;
    }
  }

  vec3 curve = vec3(x, y, z);
  pos += curve * 0.03;
  pos /= 0.98;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
