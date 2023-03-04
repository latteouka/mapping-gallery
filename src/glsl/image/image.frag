uniform float u_time;
uniform sampler2D u_imageTexture;
uniform float u_scrollVelocity;
uniform vec2 u_meshsize;

varying vec3 v_pos;
varying vec2 v_uv;

void main(void) {
  float time = u_time * 0.0001;
  vec4 color = texture2D(u_imageTexture, v_uv);

  gl_FragColor = color;
}
