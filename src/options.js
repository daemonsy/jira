import './options.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { get, set, addOnChangedListener } from './browser/storage';
import getCookieDomains from './browser/get-cookie-domains';
import jiraDomainPermissions from './browser/permissions/jira-domain';
import extractURL from './utilities/extract-url';

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
    getCookieDomains(extractURL(jiraHost).hostname).then(foundDomains => {
      if (!!jiraHost) {
        getBrowser().permissions.contains(
          jiraDomainPermissions({ jiraHost }),
          jiraDomainGranted => {
            renderComponent({ jiraHost, foundDomains, jiraDomainGranted });
          }
        );
      } else {
        renderComponent({ jiraHost, foundDomains, jiraDomainGranted: false });
      }
    });
  });
};

render();
