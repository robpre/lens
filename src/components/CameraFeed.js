import React, { Fragment, Component, createRef } from 'react';
import styled from 'styled-components';

const RenderError = ({ error }) => (error && <pre style={{ color: 'red' }}>{`${error.message}\n${error.stack || ''}`}</pre>);

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
`;

export default class CameraFeed extends Component {
  static defaultProps = {
    onVideoFeed: Function.prototype,
  };

  constructor(props) {
    super(props);

    this.video = createRef();

    this.state = {
      error: null
    };
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
          },
          width: { min: 1280, ideal: 1920 }
        }
      });
    } catch(error) {
      alert('Something went wrong, please try again.');

      return this.setState({ error });
    }

    const { current: video } = this.video;

    video.srcObject = stream;
    video.play();

    this.props.onVideoFeed(this.video.current);
  }

  render() {
    return (
      <Fragment>
        <RenderError error={this.state.error} />
        <Video autoPlay playsInline ref={this.video} />
      </Fragment>
    );
  }
}
