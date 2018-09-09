import React, { Component, createRef } from 'react';

export default class CameraFeed extends Component {
  static defaultProps = {
    onVideoFeed: Function.prototype,
  };

  constructor(props) {
    super(props);

    this.video = createRef();
  }

  async componentDidMount() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      alert('There\'s no getUserMedia');
      return;
    }
    let stream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: {
            ideal: 'environment'
          }
        }
      });
    } catch(err) {
      alert('Something went wrong, please try again.');
      throw err;
    }

    this.video.current.srcObject = stream;

    this.props.onVideoFeed(this.video.current);
  }

  render() {
    return (
      <video style={{ display: 'none' }} autoPlay ref={this.video} />
    );
  }
}
