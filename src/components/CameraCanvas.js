import React, { createRef, Component, Fragment } from 'react';

import renderVideoToCanvas from '../lib/renderVideoToCanvas';
import CameraFeed from './CameraFeed';
import TouchableCanvas from './TouchableCanvas';

export default class CameraCanvas extends Component {
  constructor(props) {
    super(props);

    this._canvas = createRef();
  }

  get canvas() {
    return this._canvas.current;
  }

  componentDidMount() {
    this.raf = requestAnimationFrame(this.update);
  }

  update = delta => {
    const { video, canvas } = this;

    if (canvas && video) {
      // update canvas
      canvas.width = canvas.scrollWidth;
      canvas.height = canvas.scrollHeight;

      renderVideoToCanvas(video, canvas);

      if (this.dragging) {
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'red';
        for(let i = 0; i < this.points.length; i++) {
          const { x, y } = this.points[i];

          ctx.fillRect(x, y, 5, 5);
        }
      }
    }

    this.raf = requestAnimationFrame(this.update);
  };

  handleFeed = video => {
    this.video = video;
  };

  handleContactMove = ({ start, end, location }) => {
    if (start) {
      this.points = [];
    }

    this.points.push(location);

    if (start) {
      this.dragging = true;
    } else if (end) {
      this.dragging = false;
    }
  };

  getContextSnapshot() {
    const { canvas, video } = this;

    if (canvas && video) {
      const ctx = canvas.getContext('2d');
      // only get the data for the video
      const width = Math.min(video.videoWidth, canvas.width);
      const height = Math.min(video.videoHeight, canvas.height);

      if (width > 0 && height > 0) {
        return ctx.getImageData(0, 0, width, height);
      }
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }

  render() {
    return (
      <Fragment>
        <CameraFeed onVideoFeed={this.handleFeed} />
        <TouchableCanvas innerRef={this._canvas} onContactMove={this.handleContactMove} />
      </Fragment>
    );
  }
}
