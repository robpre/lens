import React, { Fragment, Component, createRef } from 'react';

const RenderError = ({ error }) => (error && <pre style={{ color: 'red' }}>{`${error.message}\n${error.stack || ''}`}</pre>);

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

    this.video.current.srcObject = stream;

    this.props.onVideoFeed(this.video.current);
  }

  render() {
    return (
      <Fragment>
        <RenderError error={this.state.error} />
        <video style={{ display: 'none' }} autoPlay ref={this.video} playsInline />
      </Fragment>
    );
  }
}
