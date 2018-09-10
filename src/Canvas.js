import React, { createRef, Component, Fragment } from 'react';
import styled from 'styled-components';

import CameraFeed from './CameraFeed';
import renderVideoToCanvas from './lib/renderVideoToCanvas';

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  position: relative;
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

      // const ctx = canvas.getContext('2d');
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
