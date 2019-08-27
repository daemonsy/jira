import './popup.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { get } from './chrome/storage';
import getCookieDomains from './chrome/get-cookie-domains';

import Popup from './app/popup';

const root = document.createElement('div');
document.body.append(root);

setTimeout(() => {
  Promise.all([get(['jiraSubdomain']), getCookieDomains()]).then(
    ([{ jiraSubdomain }]) => {
      ReactDOM.render(<Popup jiraSubdomain={jiraSubdomain} />, root);
    }
  );
}, 150);
