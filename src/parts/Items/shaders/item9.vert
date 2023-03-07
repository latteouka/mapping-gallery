attribute vec2 layoutUv;

attribute float lineIndex;

attribute float lineLettersTotal;
attribute float lineLetterIndex;

attribute float lineWordsTotal;
attribute float lineWordIndex;

attribute float wordIndex;

attribute float letterIndex;

// Varyings
varying vec2 vUv;
varying vec2 vLayoutUv;
varying vec3 vViewPosition;
varying vec3 vNormal;

varying float vLineIndex;

varying float vLineLettersTotal;
varying float vLineLetterIndex;

varying float vLineWordsTotal;
varying float vLineWordIndex;

varying float vWordIndex;

varying float vLetterIndex;

float PI = 3.1415926535897932384626433832795;
uniform float u_time;
uniform float u_scrollVelocity;
uniform float u_dragVelocityX;
uniform float u_dragVelocityY;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;
uniform vec2 u_resolution;
uniform bool u_isPC;

void main() {
    // Output
    vec4 mvPosition = vec4(position, 1.0);
    mvPosition = modelViewMatrix * mvPosition;
    vec2 coord = mvPosition.xy / u_resolution;

    vec3 pos = position;
    float intensity = 0.0;
    float rotateFactor = 0.0;
    float dragIntensity = 0.0;
  
    if (u_isPC) {
      intensity = 50.0;
      rotateFactor = 10.0;
      dragIntensity = 100.0;
    } else {
      intensity = 120.0;
      rotateFactor = 0.5;
      dragIntensity = 450.0;
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

    // Varyings
    vUv = uv;
    vLayoutUv = layoutUv;
    vViewPosition = -mvPosition.xyz;
    vNormal = normal;

    vLineIndex = lineIndex;

    vLineLettersTotal = lineLettersTotal;
    vLineLetterIndex = lineLetterIndex;

    vLineWordsTotal = lineWordsTotal;
    vLineWordIndex = lineWordIndex;

    vWordIndex = wordIndex;

    vLetterIndex = letterIndex;
}
