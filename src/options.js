import './options.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { get, set, addOnChangedListener } from './browser/storage';
import getCookieDomains from './browser/get-cookie-domains';
import jiraDomainPermissions from './browser/permissions/jira-domain';

import Settings from './app/settings';
import getBrowser from './browser/get-browser';

const root = document.getElementById('options');

const setJiraHostAndRequestPermissions = jiraHost => {
  getBrowser().permissions.request(jiraDomainPermissions({ jiraHost }), () =>
    set({ jiraHost }).then(render)
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

const render = () => {
  get(['jiraHost']).then(({ jiraHost }) => {
    getCookieDomains(new URL(jiraHost).hostname).then(foundDomains => {
      getBrowser().permissions.contains(
        jiraDomainPermissions({ jiraHost }),
        jiraDomainGranted => {
          renderComponent({ jiraHost, foundDomains, jiraDomainGranted });
        }
      );
    });
  });
};

addOnChangedListener(render);

render();
