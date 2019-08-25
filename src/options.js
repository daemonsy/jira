import './options.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { get, set, addOnChangedListener } from './chrome/storage';
import getCookieDomains from './chrome/get-cookie-domains';

import Settings from './app/settings';

const root = document.getElementById('options');

const setSubdomain = jiraSubdomain => set({ jiraSubdomain });

const renderComponent = ({
  jiraSubdomain,
  foundDomains,
  onChange = setSubdomain
}) =>
  ReactDOM.render(
    <Settings
      jiraSubdomain={jiraSubdomain}
      foundDomains={foundDomains}
      onChange={onChange}
    />,
    root
  );

const render = () => {
  Promise.all([get(['jiraSubdomain']), getCookieDomains()]).then(
    ([{ jiraSubdomain }, foundDomains]) => {
      renderComponent({ jiraSubdomain, foundDomains });
    }
  );
};

addOnChangedListener(render);

render();
