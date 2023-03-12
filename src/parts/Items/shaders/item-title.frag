// Varyings
varying vec2 vUv;
varying vec2 vLayoutUv;

// Uniforms: Common
uniform float uOpacity;
uniform float uThreshold;
uniform float uAlphaTest;
uniform vec3 uColor;
uniform sampler2D uMap;

// Uniforms: Strokes
uniform vec3 uStrokeColor;
uniform float uStrokeOutsetWidth;
uniform float uStrokeInsetWidth;

uniform vec2 u_meshSize;
uniform float u_progress1;
uniform float u_progress2;
uniform float u_progress3;
uniform float u_progress4;

// Utils: Median
float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
    // Common
    // Texture sample
    vec3 s = texture2D(uMap, vUv).rgb;

    // Signed distance
    float sigDist = median(s.r, s.g, s.b) - 0.5;

    float afwidth = 1.4142135623730951 / 2.0;

    #ifdef IS_SMALL
        float alpha = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDist);
    #else
        float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
    #endif

    // Strokes
    // Outset
    float sigDistOutset = sigDist + uStrokeOutsetWidth * 0.5;

    // Inset
    float sigDistInset = sigDist - uStrokeInsetWidth * 0.5;

    #ifdef IS_SMALL
        float outset = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistOutset);
        float inset = 1.0 - smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistInset);
    #else
        float outset = clamp(sigDistOutset / fwidth(sigDistOutset) + 0.5, 0.0, 1.0);
        float inset = 1.0 - clamp(sigDistInset / fwidth(sigDistInset) + 0.5, 0.0, 1.0);
    #endif

    // Border
    float border = outset * inset;

    // Alpha Test
    // if (alpha < uAlphaTest) discard;

    // Some animation
    // alpha *= sin(uTime);

    // Output: Common
    
    vec2 uv = vLayoutUv;
    float x = floor(uv.x * 5.0);
    float y = floor(uv.y * 5.0);
    float pattern = noise(vec2(x, y));

    vec3 color_red = vec3(0.911, 0.284, 0.372);
    vec3 color_pink = vec3(0.972, 0.811, 0.813);

    // layers
    vec4 l1 = vec4(1.0, 1.0, 1.0, border * 0.5);
    vec4 l2 = vec4(1.0, 1.0, 1.0, border);
    vec4 l3 = vec4(color_red, alpha);
    vec4 l4 = vec4(1.0, 1.0, 1.0, alpha);

    float w = 0.5;

    float p0 = u_progress1;
    p0 = map(p0, 0.0, 1.0, -w, 1.0);
    p0 = smoothstep(p0, p0+w, uv.x);
    // left to right
    float mix0 = 1.0 - (2.0 * p0 - pattern);
    mix0 = clamp(mix0, 0.0, 1.0);

    float p1 = u_progress2;
    p1 = map(p1, 0.0, 1.0, -w, 1.0);
    p1 = smoothstep(p1, p1+w, uv.x);
    float mix1 = 1.0 - (2.0 * p1 - pattern);
    mix1 = clamp(mix1, 0.0, 1.0);

    float p2 = u_progress3;
    p2 = map(p2, 0.0, 1.0, -w, 1.0);
    p2 = smoothstep(p2, p2+w, uv.x);
    float mix2 = 1.0 - (2.0 * p2 - pattern);
    mix2 = clamp(mix2, 0.0, 1.0);

    float p3 = u_progress4;
    p3 = map(p3, 0.0, 1.0, -w, 1.0);
    p3 = smoothstep(p3, p3+w, uv.x);
    float mix3 = 1.0 - (2.0 * p3 - pattern);
    mix3 = clamp(mix3, 0.0, 1.0);

    vec4 layer0 = mix(vec4(0.0), l1, mix0);
    vec4 layer1 = mix(layer0, l2, mix1);
    vec4 layer2 = mix(layer1, l3, mix2);
    vec4 layerFinal = mix(layer2, l4, mix3);

    vec4 filledFragColor = vec4(vec3(mix0), uOpacity * alpha);


    gl_FragColor = layerFinal;
}
