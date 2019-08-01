import React from 'react';
import ReactDOM from 'react-dom';
import nonce from 'nonce-generator';
import './index.css';
import App from './components/App';

window.sessionStorage.setItem('nonce', nonce(16));
ReactDOM.render(<App />, document.getElementById('root'));
