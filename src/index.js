import React from 'react';
import ReactDOM from 'react-dom';
import 'webrtc-adapter';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
window.onerror = (err) => {
  document.getElementById('root').innerHTML = `<pre>${err}\n${err.message}\n${err.stack}${JSON.stringify(err, null, '  ')}</pre>`;
};

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

