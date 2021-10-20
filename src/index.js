import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
const store = createStore(rootReducer)

ReactDOM.render(
    <Provider store={store}>
        <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
