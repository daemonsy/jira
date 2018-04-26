import './options.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { get, set, addOnChangedListener } from './chrome/storage';
import getCookieDomains from './chrome/get-cookie-domains';

import Settings from './app/settings';

const root = document.getElementById('options');

const setSubdomain = jiraSubdomain =>
  set({ jiraSubdomain }, null);

const render = () =>
  Promise.all([get(['jiraSubdomain']), getCookieDomains()]).then(([{ jiraSubdomain }, foundDomains]) => {
    ReactDOM.render(
      <Settings
        jiraSubdomain={jiraSubdomain}
        foundDomains={foundDomains}
        onChange={setSubdomain}
      />,
      root
    )
  });

addOnChangedListener(({ jiraSubdomain }) => {
  if (jiraSubdomain) {
    render();
  }
});

render();
