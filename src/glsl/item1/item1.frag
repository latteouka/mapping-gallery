uniform float u_time;
uniform sampler2D u_imageTexture;
uniform sampler2D u_noiseTexture;
uniform float u_scrollVelocity;
uniform float u_dragVelocityX;
uniform float u_dragVelocityY;
uniform vec2 u_meshSize;
uniform vec2 u_textureSize;

varying vec3 v_pos;
varying vec2 v_uv;

float PI = 3.1415926535897932384626433832795;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main(void) {
  float time = u_time * 0.0001;

  vec2 ratio = vec2(
      min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),
      min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)
  );

  vec2 uv = v_uv;

  vec4 noise = texture2D(u_noiseTexture, uv);
  vec2 distortUv = uv + rotate2d(PI / 1.34) * vec2(noise.r, noise.g) * u_scrollVelocity * 0.005;
  // distortUv += rotate2d(PI / 1.34) * vec2(noise.r, noise.g) * u_dragVelocityX * 0.005;
  // distortUv += rotate2d(PI / 1.34) * vec2(noise.r, noise.g) * u_dragVelocityY * 0.005;

  vec4 color = texture2D(u_noiseTexture, uv);

  gl_FragColor = color;
}
