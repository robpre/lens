import React, { Component, createRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Create from '@material-ui/icons/Create';
import Fullscreen from '@material-ui/icons/Fullscreen';
import FullscreenExit from '@material-ui/icons/FullscreenExit';
import screenfull from 'screenfull';
import styled from 'styled-components';

import Canvas from './Canvas';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 0;
`;

const Controls = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: space-between;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.containerRef = createRef();

    this.state = {
      fullscreen: false,
    };
  }

  handleFullscreenClick = () => {
    const { current } = this.containerRef;

    if (current) {
      if (this.state.fullscreen) {
        screenfull.exit();
      } else {
        screenfull.request(current);
      }
    }
  };

  handleFullscreenChange = () => {
    this.setState({ fullscreen: screenfull.isFullscreen });
  };

  handleSelectColour = () => {

  };

  componentDidMount() {
    screenfull.on('change', this.handleFullscreenChange);
  }

  componentWillUnmount() {
    screenfull.off('change', this.handleFullscreenChange);
  }

  render() {
    return (
      <Container innerRef={this.containerRef}>
        <Controls>
          <IconButton size="large" color="primary" onClick={this.handleSelectColour}>
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
        <Canvas />
      </Container>
    );
  }
}

export default App;
