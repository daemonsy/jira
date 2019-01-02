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

const render = () =>
  Promise.all([get(['jiraSubdomain', 'githubURL']), getCookieDomains()]).then(([{ jiraSubdomain, githubURL }, foundDomains]) => {
    chrome.permissions.contains(githubFeaturePermissions({ githubURL, jiraSubdomain }), result => {
      ReactDOM.render(
        <Settings
          jiraSubdomain={jiraSubdomain}
          githubURL={githubURL}
          githubPermissionGranted={!!result}
          foundDomains={foundDomains}
          onChange={setSubdomain}
          onGithubURLChange={setGithubURL}
          onRequestGithubPermissions={requestGithubPermissions}
        />,
        root
      )
    });
  });

addOnChangedListener(({ jiraSubdomain, githubURL }) => {
  if (jiraSubdomain || githubURL) {
    render();
  }
});

render();
