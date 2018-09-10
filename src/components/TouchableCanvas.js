import React, { Component, forwardRef } from 'react';

import styled from 'styled-components';

const getXYFromEvent = (evt) => ({
  x: evt.pageX,
  y: evt.pageY,
});

const forwardedRef = Component => forwardRef((props, ref) => <Component {...props} forwardedRef={ref} />);

class TouchableCanvas extends Component {
  handleInteraction = evt => {
    const start = evt.type === 'touchstart' || evt.type === 'mousedown';
    const end = evt.type === 'touchend' || evt.type === 'mouseup';

    if (start) {
      this.started = true;
    }

    if (this.started) {
      let location;

      if (evt.type === 'touchstart' || evt.type === 'touchmove' || evt.type === 'touchend') {
        const [ touch ] = evt.changedTouches;

        if (touch) {
          location = getXYFromEvent(touch);
        }
      } else {
        location = getXYFromEvent(evt);
      }

      if (location) {
        this.props.onContactMove({
          start,
          end,
          location,
        });
      }
    }

    if (end) {
      this.started = false;
    }
  };

  render() {
    const { forwardedRef, className } = this.props;

    return (
      <canvas
        className={className}
        ref={forwardedRef}
        // mouses
        onMouseDown={this.handleInteraction}
        onMouseMove={this.handleInteraction}
        onMouseUp={this.handleInteraction}
        // touches
        onTouchStart={this.handleInteraction}
        onTouchMove={this.handleInteraction}
        onTouchEnd={this.handleInteraction}
      />
    );
  }
}

export default styled(forwardedRef(TouchableCanvas))`
  width: 100%;
  height: 100%;
  position: relative;
`;
