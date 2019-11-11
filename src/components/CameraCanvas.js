import React, { Component, Fragment } from 'react';

import {
  createProgram,
  createQuad,
  createTexture,
  resize,
} from '../lib/webGLUtils';
import CameraFeed from './CameraFeed';
import TouchableCanvas from './TouchableCanvas';
import { vs, fs } from './shaders';

export default class CameraCanvas extends Component {
  componentDidMount() {
    this.raf = requestAnimationFrame(this.update);
  }

  initCanvas = (el) => {
    const canvas = this.canvas = el;
    const gl = this.gl = canvas.getContext('webgl2', {preserveDrawingBuffer: true});

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    createQuad(gl);

    const program = this.program = createProgram(gl, vs, fs);

    gl.useProgram(program);

    this.colorToReplaceLocation = gl.getUniformLocation(program, 'colorToReplace');
    this.thresholdSensitivityLocation = gl.getUniformLocation(program, 'thresholdSensitivity');
    this.smoothingLocation = gl.getUniformLocation(program, 'smoothing');
    this.initLocation = gl.getUniformLocation(program, 'init');
  };

  getSourceTexture = () => {
    if (this.texture) {
      return this.texture;
    }

    if (this.video && this.gl) {
      this.texture = createTexture(this.gl, this.video);
    }
  };

  update = delta => {
    this.raf = requestAnimationFrame(this.update);
    const { video, canvas, gl } = this;

    if (!canvas || !video) {
      return;
    }

    const { clientWidth: sw, clientHeight: sh } = video;
    if (sw !== canvas.width || sh !== canvas.height) {
      resize(gl, sw, sh);
    }

    const texture = this.getSourceTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

    if (this.point) {
      this.setSourceColour(this.point);
      this.point = null;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  setSourceColour({ x, y }) {
    const {
      gl,
      colorToReplaceLocation,
      thresholdSensitivityLocation,
      smoothingLocation,
      initLocation,
    } = this;

    const pixels = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    const replaceCol = [];

    pixels.slice(0, 3).forEach(pix => replaceCol.push(pix / 255));
    console.log(replaceCol);

    gl.uniform3fv(colorToReplaceLocation, new Float32Array(replaceCol));
    gl.uniform1f(thresholdSensitivityLocation, 0.4);
    gl.uniform1f(smoothingLocation, 0.05);
    gl.uniform1i(initLocation, 1);
  }

  handleFeed = video => {
    this.video = video;
  };

  handleContactMove = ({ point }) => {
    const {
      gl,
    } = this;

    if (gl && point) {
      this.point = point;
    }
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
  }

  render() {
    return (
      <Fragment>
        <CameraFeed onVideoFeed={this.handleFeed} />
        <TouchableCanvas ref={this.initCanvas} onContactMove={this.handleContactMove} />
      </Fragment>
    );
  }
}
