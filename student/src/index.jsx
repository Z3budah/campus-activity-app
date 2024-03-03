import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


/* REDUX */
import { Provider } from 'react-redux';
import store from './store'

/* ANTD */
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';


/* REM */
import 'lib-flexible'
import './assets/reset.min.css';
import './index.less'


/* handle maxWidth */
(function () {
  const handleMax = function handleMax() {
    let html = document.documentElement,
      root = document.getElementById('root'),
      deviceW = html.clientWidth;
    root.style.maxWidth = '750px';
    if (deviceW >= 750) {
      html.style.fontSize = '75px';
    }
  };
  handleMax();
  window.addEventListener('resize', handleMax);
})();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);
