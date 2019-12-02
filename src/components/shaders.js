const glsl = strings => strings.join('');

export const vs = glsl`
#version 300 es

in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`.trim();

export const fs = glsl`
#version 300 es
precision highp float;

out vec4 fragColor;
uniform sampler2D videoSrc;
uniform vec3 colorToReplace;
uniform float thresholdSensitivity;
uniform float smoothing;
uniform bool init;

void main() {
  ivec2 px = ivec2(gl_FragCoord.xy);
  vec4 textureColor = vec4(texelFetch(videoSrc, px, 0).rgb, 1.0);

  if (!init) {
    fragColor = textureColor;
    return;
  }

  float maskY = 0.2989 * colorToReplace.r + 0.5866 * colorToReplace.g + 0.1145 * colorToReplace.b;
  float maskCr = 0.7132 * (colorToReplace.r - maskY);
  float maskCb = 0.5647 * (colorToReplace.b - maskY);

  float Y = 0.2989 * textureColor.r + 0.5866 * textureColor.g + 0.1145 * textureColor.b;
  float Cr = 0.7132 * (textureColor.r - Y);
  float Cb = 0.5647 * (textureColor.b - Y);

  float blendValue = smoothstep(thresholdSensitivity, thresholdSensitivity + smoothing, distance(vec2(Cr, Cb), vec2(maskCr, maskCb)));

  fragColor = vec4(textureColor.rgb, textureColor.a * blendValue);
}
`.trim();
