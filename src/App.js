import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Create from '@material-ui/icons/Create';
import Fullscreen from '@material-ui/icons/Fullscreen';
import FullscreenExit from '@material-ui/icons/FullscreenExit';
import screenfull from 'screenfull';
import styled from 'styled-components';
import hexToHsl from 'hex-to-hsl';
import CirclePicker from 'react-color/lib/Circle';

import Canvas from './components/CameraCanvas';

const hues = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b']
  .map(hex => `hsl(${hexToHsl(hex)[0]}, 100%, 87.5%)`);

const formatError = (error, info) => {
  let message = '';

  if (error) {
    if (error.message && error.stack) {
      message += `${error.message}\n${error.stack}`;
    } else {
      message += error;
    }
  }

  if (info) {
    message += `\n${JSON.stringify(info, null, '  ')}`;
  }

  return message;
};

const Container = styled.div`
  ${props => props.fullscreen ? `
    height: 100vh;
    width: 100vw;
  ` : `
    width: 100%;
    height: 100%;
  `}
  position: relative;
  font-size: 0;
  overflow: hidden;
`;

const Controls = styled.div`
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  display: flex;
  justify-content: space-between;
`;

const OnTop = styled.div`
  position: relative;
  z-index: 1;
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Pre = styled.pre`
  width: 100%;
  height: 100%;
  color: red;
  background: white;
  font-size: 2rem;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullscreen: false,
      modalOpen: false,
      selectedColour: '#f6bfff',
      error: null,
      info: null,
    };
  }

  handleFullscreenClick = () => {
    if (this.state.fullscreen) {
      screenfull.exit();
    } else {
      screenfull.request(document.body);
    }
  };

  handleFullscreenChange = () => {
    this.setState({ fullscreen: screenfull.isFullscreen });
  };

  handleSwatchOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleSwatchClose = () => {
    this.setState({ modalOpen: false });
  };

  handleColourSelect = (colour) => {
    this.setState({
      modalOpen: false,
      selectedColour: colour.hex,
    });
  };

  componentDidCatch(error, info) {
    this.setState({
      error,
      info
    });
  }

  componentDidMount() {
    window.onerror = error => this.setState({ error });
    if (screenfull.enabled) {
      screenfull.on('change', this.handleFullscreenChange);
    }
  }

  componentWillUnmount() {
    if (screenfull.enabled) {
      screenfull.off('change', this.handleFullscreenChange);
    }
  }

  render() {
    return (
      <Container fullscreen={this.state.fullscreen}>
        <Controls>
          <OnTop>
            <IconButton size="large" color="primary" onClick={this.handleSwatchOpen}>
              <Create />
            </IconButton>
          </OnTop>
          {
            screenfull.enabled ? (
              <OnTop>
                <IconButton size="large" color="primary" onClick={this.handleFullscreenClick}>
                  {this.state.fullscreen ?  <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </OnTop>
            ) : <div />
          }
        </Controls>
        <Canvas replaceColour={this.state.selectedColour} />
        <Modal open={this.state.modalOpen}>
          <Centered onClick={this.handleSwatchClose} tabIndex="-1">
            <CirclePicker onChangeComplete={this.handleColourSelect} colors={hues} />
          </Centered>
        </Modal>
        <Modal open={!!this.state.error}>
          <Centered>
            <Pre>{formatError(this.state.error, this.state.info)}</Pre>
          </Centered>
        </Modal>
      </Container>
    );
  }
}

export default App;
