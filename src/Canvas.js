import React, { createRef, Component, Fragment } from 'react';
import styled from 'styled-components';

import CameraFeed from './CameraFeed';

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvas = createRef();
  }

  componentDidMount() {
    this.raf = requestAnimationFrame(this.update);
  }

  update = delta => {
    if (this.canvas.current && this.video) {
      const {
        video,
        canvas: {
          current: canvas
        }
      } = this;
      const ctx = this.canvas.current.getContext('2d');

      canvas.width = canvas.scrollWidth;
      canvas.height = canvas.scrollHeight;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // scale and horizontally center the camera image
        const sourceX = Math.max((video.videoWidth - canvas.width) / 2, 0);
        const sourceY = Math.max((video.videoHeight - canvas.height) / 2, 0);
        const sourceWidth = canvas.width;
        const sourceHeight = canvas.height;

        ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
      }
    }

    this.raf = requestAnimationFrame(this.update);
  };

  handleFeed = video => {
    this.video = video;
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }

  render() {
    return (
      <Fragment>
        <CameraFeed onVideoFeed={this.handleFeed} />
        <StyledCanvas innerRef={this.canvas} />
      </Fragment>
    );
  }
}
