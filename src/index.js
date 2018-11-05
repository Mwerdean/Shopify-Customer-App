import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AppProvider } from '@shopify/polaris';
import { BrowserRouter } from 'react-router-dom';
import '@shopify/polaris/styles.css';


ReactDOM.render(
<AppProvider apiKey='' shopOrigin=''>
    <BrowserRouter>
    <App />
    </BrowserRouter>
</AppProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
