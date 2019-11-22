import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import {
  createProgram,
  createQuad,
  createTexture,
  resize,
} from '../lib/webGLUtils';
import CameraFeed from './CameraFeed';
import TouchableCanvas from './TouchableCanvas';
import { vs, fs } from './shaders';

const Notify = styled.div`
  background: ${props => props.c};
  position: fixed;
  top: 0;
  left: 0;
  height: 100px;
  width: 100px;
  z-index: 9999;
`;

export default class CameraCanvas extends Component {
  componentDidMount() {
    this.raf = requestAnimationFrame(this.update);
  }

  state = {
    c: '',
  };

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

    return this.texture;
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
      if (this.initVal) {
        this.disableChroma();
      } else {
        const success = this.setSourceColour(this.point);

        if (success) {
          this.point = null;
        }
      }
    }

    const { r, g, b, a } = this.props.replaceColour;

    gl.clearColor(r,g,b,a);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  setSourceColour({ x, y }) {
    const {
      gl,
      colorToReplaceLocation,
      thresholdSensitivityLocation,
      smoothingLocation,
      canvas,
    } = this;
    const realX = x - canvas.offsetLeft;
    const realY = y - canvas.offsetTop;

    const pixels = new Uint8Array(4);
    gl.readPixels(realX, realY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    const replaceCol = [];

    pixels.slice(0, 3).forEach(pix =>
      replaceCol.push(parseFloat((pix / 255).toFixed(2)))
    );

    if (replaceCol.every(x => !x)) {
      this.disableChroma();
      return false;
    }
    console.log(replaceCol);
    this.setState({
      c: `rgb(${replaceCol.map(x => x*255).join(',')})`
    });

    gl.uniform3fv(colorToReplaceLocation, new Float32Array(replaceCol));
    gl.uniform1f(thresholdSensitivityLocation, 0.4);
    gl.uniform1f(smoothingLocation, 0.05);
    this.enableChroma();

    return true;
  }

  enableChroma() {
    this.setInitVal(true);
  }
  disableChroma() {
    this.setInitVal(false);
  }

  setInitVal(newVal) {
    const { gl, initLocation } = this;
    this.initVal = newVal;

    gl.uniform1i(initLocation, newVal ? 1 : 0);
  }

  handleFeed = video => {
    this.video = video;
  };

  handleContactMove = ({ point, end }) => {
    if (!end) return;

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
        <Notify c={this.state.c} />
        <CameraFeed onVideoFeed={this.handleFeed} />
        <TouchableCanvas ref={this.initCanvas} onContactMove={this.handleContactMove} />
      </Fragment>
    );
  }
}
