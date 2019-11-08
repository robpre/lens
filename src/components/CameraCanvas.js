import React, { createRef, Component, Fragment } from 'react';
// import rgbToHsl from 'rgb-to-hsl';

import renderVideoToCanvas from '../lib/renderVideoToCanvas';
import CameraFeed from './CameraFeed';
import TouchableCanvas from './TouchableCanvas';

const similar = (val, targetVal, fuzz) =>
  (targetVal < val + fuzz && targetVal > val - fuzz);

const getPixel = (image, x, y) => {
  // target = MAX * (y - 1) + x
  let rIndex = (image.width * (y - 1)) + x;
  // adjust for 0 indexed array
  rIndex -= 1;
  // multiply by colour width: 4
  rIndex *= 4;

  const r = image.data[rIndex];
  const g = image.data[rIndex + 1];
  const b = image.data[rIndex + 2];
  const a = image.data[rIndex + 3];

  return { r, g, b, a };
};

export default class CameraCanvas extends Component {
  constructor(props) {
    super(props);

    this._canvas = createRef();
    this.points = [];
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
      const ctx = canvas.getContext('2d');
      // update canvas
      canvas.width = canvas.scrollWidth;
      canvas.height = canvas.scrollHeight;

      ctx.fillStyle = this.props.replaceColour;
      ctx.fillRect(0, 0, video.videoWidth, video.videoHeight);

      renderVideoToCanvas(video, canvas, ctx);

      const image = this.getContextSnapshot(ctx);

      if (image && image.data) {
        if (1 || this.dragging) {
          for(let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            const { x, y } = point;

            if (this.dragging || !point.colour) {
              point.colour = getPixel(image, x, y);
            }

            const { r, g, b } = point.colour;

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x - 12, y - 12, 24, 24);
          }
        }

        // if (this.points.length) {
        //   for (let pixel = 0; pixel < image.data.length; pixel += 4) {
        //     const r = image.data[pixel];
        //     const g = image.data[pixel + 1];
        //     const b = image.data[pixel + 2];
        //     const pixelHsl = rgbToHsl(r, g, b);

        //     for (let i = 0; i < this.points.length; i++) {
        //       const { colour } = this.points[i];
        //       const targetHsl = rgbToHsl(colour.r, colour.g, colour.b);

        //       if (
        //         similar(pixelHsl[0], targetHsl[0], 2) &&
        //         similar(pixelHsl[1], targetHsl[1], 5) &&
        //         similar(pixelHsl[2], targetHsl[2], 10)
        //       ) {
        //         image.data[pixel + 3] = 0;
        //         break;
        //       }
        //     }
        //   }

        //   ctx.putImageData(image, 0, 0);
        // }

      }
    }

    this.raf = requestAnimationFrame(this.update);
  };

  handleFeed = video => {
    this.video = video;
  };

  handleContactMove = ({ start, end, point }) => {
    if (start) {
      this.points = [];
    }

    this.points.push(point);

    if (start) {
      this.dragging = true;
    } else if (end) {
      this.dragging = false;
    }
  };

  getContextSnapshot(ctx) {
    const { canvas, video } = this;

    if (canvas && video) {
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
