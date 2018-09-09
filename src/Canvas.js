import React, { createRef, Component } from 'react';

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvas = createRef();
  }

  componentDidMount() {
    this.raf = requestAnimationFrame(this.update);
  }

  update = delta => {
    if (this.canvas.current) {
      const canvas = this.canvas.current;
      const ctx = this.canvas.current.getContext('2d');

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    this.raf = requestAnimationFrame(this.update);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }

  render() {
    return (
      <canvas style={{ width: '100%', height: '100%' }} ref={this.canvas} />
    );
  }
}
