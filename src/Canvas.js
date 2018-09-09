import React, { createRef, Component, Fragment } from 'react';
import CameraFeed from './CameraFeed';

// function maintainAspect(srcSize, dstSize) {
//   const srcRatio = srcSize.width / srcSize.height;
//   const dstRatio = dstSize.width / dstSize.height;
//   if (dstRatio > srcRatio) {
//     return {
//       width:  dstSize.height * srcRatio,
//       height: dstSize.height
//     };
//   } else {
//     return {
//       width:  dstSize.width,
//       height: dstSize.width / srcRatio
//     };
//   }
// }

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

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // scale and horizontally center the camera image
        // const videoSize = { width: video.videoWidth, height: video.videoHeight };
        // const canvasSize = { width: canvas.width, height: canvas.height };
        // const renderSize = maintainAspect(videoSize, canvasSize);
        // const xOffset = (canvasSize.width - renderSize.width) / 2;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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
        <canvas style={{ width: '100%', height: '100%' }} ref={this.canvas} />
      </Fragment>
    );
  }
}
