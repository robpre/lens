import React, { Component, forwardRef } from 'react';

import styled from 'styled-components';

const getXYFromEvent = (evt) => ({
  x: Math.round(evt.clientX),
  y: Math.round(evt.clientY),
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
      let point;

      if (evt.type === 'touchstart' || evt.type === 'touchmove' || evt.type === 'touchend') {
        const [ touch ] = evt.changedTouches;

        if (touch) {
          point = getXYFromEvent(touch);
        }
      } else {
        point = getXYFromEvent(evt);
      }

      if (point) {
        this.props.onContactMove({
          start,
          end,
          point,
        });
      }
    }

    if (end) {
      // debugger;
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
