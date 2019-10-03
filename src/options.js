import './options.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { get, set, addOnChangedListener } from './browser/storage';
import getCookieDomains from './browser/get-cookie-domains';
import jiraDomainPermissions from './browser/permissions/jira-domain';

import Settings from './app/settings';
import getBrowser from './browser/get-browser';

const root = document.getElementById('options');
const browser = getBrowser();

const setJiraHostAndRequestPermissions = jiraHost => {
  browser.permissions.request(
    jiraDomainPermissions({ jiraHost }),
    jiraDomainGranted => {
      set({ jiraHost }).then(() => render({ jiraDomainGranted }));
    }
  );
};

const renderComponent = ({ jiraHost, foundDomains, jiraDomainGranted }) =>
  ReactDOM.render(
    <Settings
      storedJiraHost={jiraHost}
      foundDomains={foundDomains}
      jiraDomainGranted={jiraDomainGranted}
      setJiraHost={jiraHost => setJiraHostAndRequestPermissions(jiraHost)}
    />,
    root
  );

const render = ({ jiraDomainGranted } = {}) => {
  Promise.all([get(['jiraHost']), getCookieDomains()]).then(
    ([{ jiraHost }, foundDomains]) => {
      renderComponent({ jiraHost, foundDomains, jiraDomainGranted });
    }
  );
};

addOnChangedListener(render);

render();
