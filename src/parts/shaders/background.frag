uniform float u_time;
uniform sampler2D u_imageTexture;
uniform sampler2D u_noiseTexture;
uniform float u_scrollVelocity;
uniform float u_dragVelocityX;
uniform float u_dragVelocityY;
uniform sampler2D u_texture;

varying vec3 v_pos;
varying vec2 v_uv;

float PI = 3.1415926535897932384626433832795;


void main(void) {
  // float time = u_time * 0.0001;
  vec2 newUv = v_uv;

  // vec2 centeredUV = 2.0 * v_uv - vec2(1.0);
  vec2 centeredUV = v_uv - vec2(0.5);

  for(int i = 1; i < 5; i++) {
    centeredUV.x += 0.2 * float(i) * sin(float(i) * 1.3 * centeredUV.y + float(i) * u_time);
    centeredUV.y -= 0.15 * float(i) * cos(float(i) * 5.4 * centeredUV.x + float(i) * u_time);
  }
  centeredUV += 0.1 * cos(2.0 * centeredUV.yx + u_time / 20.0);

  newUv.x = length(centeredUV);
  newUv.y = 0.0;

  vec4 color = texture2D(u_texture, newUv);
  gl_FragColor = color;
}
