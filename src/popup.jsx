import './popup.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { get } from './browser/storage';
import getCookieDomains from './browser/get-cookie-domains';

import Popup from './app/popup';

const root = document.createElement('div');
document.body.append(root);

setTimeout(() => {
  Promise.all([get(['jiraHost']), getCookieDomains()]).then(
    ([{ jiraHost }]) => {
      ReactDOM.render(<Popup jiraHost={jiraHost} />, root);
    }
  );
}, 150);
