const glsl = x => x.join('');

const canvas = document.createElement('canvas');
canvas.id = "target";
document.body.appendChild(canvas);

const source = document.createElement('video');
source.src = "lion.mp4"
source.loop = true;
source.autoplay = true;
source.crossOrigin = "anonymous";
document.body.appendChild(source);

const vs = glsl`
#version 300 es

in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`.trim()

const fs = glsl`
#version 300 es
precision highp float;

out vec4 fragColor;
uniform sampler2D videoSrc;
uniform vec3 colorToReplace;
uniform float thresholdSensitivity;
uniform float smoothing;

void main() {
  ivec2 px = ivec2(gl_FragCoord.xy);
  vec4 textureColor = vec4(texelFetch(videoSrc, px, 0).rgb, 1.0);

  float maskY = 0.2989 * colorToReplace.r + 0.5866 * colorToReplace.g + 0.1145 * colorToReplace.b;
  float maskCr = 0.7132 * (colorToReplace.r - maskY);
  float maskCb = 0.5647 * (colorToReplace.b - maskY);

  float Y = 0.2989 * textureColor.r + 0.5866 * textureColor.g + 0.1145 * textureColor.b;
  float Cr = 0.7132 * (textureColor.r - Y);
  float Cb = 0.5647 * (textureColor.b - Y);

  float blendValue = smoothstep(thresholdSensitivity, thresholdSensitivity + smoothing, distance(vec2(Cr, Cb), vec2(maskCr, maskCb)));

  fragColor = vec4(textureColor.rgb, textureColor.a * blendValue);
}
`.trim()

setTimeout(start, 1000)

function start() {
  const gl = canvas.getContext("webgl2");

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const p = createProgram(gl, vs, fs);

  const colorToReplaceLocation = gl.getUniformLocation(p, 'colorToReplace');
  const thresholdSensitivityLocation = gl.getUniformLocation(p, 'thresholdSensitivity');
  const smoothingLocation = gl.getUniformLocation(p, 'smoothing');

  gl.useProgram(p);
  gl.uniform3fv(colorToReplaceLocation, new Float32Array([0, 1, 0]))
  gl.uniform1f(thresholdSensitivityLocation, 0.4)
  gl.uniform1f(smoothingLocation, 0.05)

  createQuad(gl);

  const texture = createTexture(gl, source)

  function loop() {
    requestAnimationFrame(loop);
    let [w, h] = [source.clientWidth, source.clientHeight];
    if (w != target.width || h != target.height) {
      resize(gl, w, h);
      source.dispatchEvent(new CustomEvent("update"));
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, source);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  loop();
}
