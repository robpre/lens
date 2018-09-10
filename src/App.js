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

import Canvas from './CameraCanvas';

const hues = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b']
  .map(hex => `hsl(${hexToHsl(hex)[0]}, 100%, 87.5%)`);

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 0;
  overflow: hidden;
`;

const Controls = styled.div`
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  position: absolute;
  display: flex;
  justify-content: space-between;
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullscreen: false,
      modalOpen: false,
      selectedColour: '#f6bfff',
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

  componentDidMount() {
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
      <Container>
        <Controls>
          <IconButton size="large" color="primary" onClick={this.handleSwatchOpen}>
            <Create />
          </IconButton>
          {
            screenfull.enabled ? (
              <IconButton size="large" color="primary" onClick={this.handleFullscreenClick}>
                {this.state.fullscreen ?  <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            ) : <div />
          }
        </Controls>
        <Canvas replaceColour={this.state.selectedColour} />
        <Modal open={this.state.modalOpen}>
          <Centered onClick={this.handleSwatchClose} tabIndex="-1">
            <CirclePicker onChangeComplete={this.handleColourSelect} colors={hues} />
          </Centered>
        </Modal>
      </Container>
    );
  }
}

export default App;
