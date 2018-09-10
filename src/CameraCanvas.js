import React, { createRef, Component, Fragment } from 'react';

import CameraFeed from './CameraFeed';
import renderVideoToCanvas from './lib/renderVideoToCanvas';
import TouchableCanvas from './TouchableCanvas';

export default class CameraCanvas extends Component {
  constructor(props) {
    super(props);

    this.canvas = createRef();
  }

  componentDidMount() {
    this.raf = requestAnimationFrame(this.update);
  }

  update = delta => {
    const {
      video,
      canvas: {
        current: canvas
      }
    } = this;

    if (canvas && video) {
      // update canvas
      canvas.width = canvas.scrollWidth;
      canvas.height = canvas.scrollHeight;

      renderVideoToCanvas(video, canvas);

      const ctx = canvas.getContext('2d');

      if (this.points) {
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

  handleContactMove = ({ start, location }) => {
    if (start) {
      this.points = [];
    }

    this.points.push(location);
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }

  render() {
    return (
      <Fragment>
        <CameraFeed onVideoFeed={this.handleFeed} />
        <TouchableCanvas innerRef={this.canvas} onContactMove={this.handleContactMove} />
      </Fragment>
    );
  }
}
