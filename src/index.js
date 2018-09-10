import React from 'react';
import ReactDOM from 'react-dom';
import 'webrtc-adapter';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
window.onerror = (err) => {
  document.getElementById('root').innerHTML = `<pre>${err.message}\n${err.stack}</pre>`;
};

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

