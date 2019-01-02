import './options.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { get, set, addOnChangedListener } from './chrome/storage';
import getCookieDomains from './chrome/get-cookie-domains';
import githubFeaturePermissions from './chrome/permissions/github-feature';

import Settings from './app/settings';

const root = document.getElementById('options');

const setSubdomain = jiraSubdomain =>
  set({ jiraSubdomain });

const setGithubURL = githubURL => set({ githubURL });

const requestGithubPermissions = () => {
  get(['githubURL', 'jiraSubdomain']).then(({ githubURL, jiraSubdomain }) => {
    chrome.permissions.request(githubFeaturePermissions({ githubURL, jiraSubdomain }), granted => {
      render();
    });
  });
}

const renderComponent = ({ jiraSubdomain, githubURL, githubPermissionGranted = false, foundDomains, onChange = setSubdomain, onGithubURLChange = setGithubURL , onRequestGithubPermissions = requestGithubPermissions }) =>
  ReactDOM.render(
    <Settings
      jiraSubdomain={jiraSubdomain}
      githubURL={githubURL}
      githubPermissionGranted={githubPermissionGranted}
      foundDomains={foundDomains}
      onChange={onChange}
      onGithubURLChange={onGithubURLChange}
      onRequestGithubPermissions={onRequestGithubPermissions}
    />,
    root)

const render = () => {
  Promise.all([get(['jiraSubdomain', 'githubURL']), getCookieDomains()]).then(([{ jiraSubdomain, githubURL }, foundDomains]) => {
    if (githubURL) {
      try {
        chrome.permissions.contains(githubFeaturePermissions({ githubURL, jiraSubdomain }), githubPermissionGranted => {
          renderComponent({ jiraSubdomain, githubURL, githubPermissionGranted, foundDomains });
        });
      } catch (e) {
        renderComponent({ jiraSubdomain, githubURL, githubPermissionGranted: false, foundDomains });
      }
    } else {
      renderComponent({ jiraSubdomain, githubURL, foundDomains });
    }
  });
};

addOnChangedListener(render);

render();
