import './options.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { get, set, addOnChangedListener } from './chrome/storage';
import getCookieDomains from './chrome/get-cookie-domains';

import Settings from './app/settings';

const root = document.getElementById('options');

const setSubdomain = jiraSubdomain =>
  set({ jiraSubdomain });

const setGithubURL = githubURL => set({ githubURL });

const requestGithubPermissions = () => {
  get(['githubURL']).then(({ githubURL}) => {
    chrome.permissions.request({
      permissions: ["webRequest", "webRequestBlocking", "tabs"],
      origins: [`*://${githubURL}/*`]
    }, (granted) => {

    });
  });
}

const render = () =>
  Promise.all([get(['jiraSubdomain', 'githubURL']), getCookieDomains()]).then(([{ jiraSubdomain, githubURL }, foundDomains]) => {
    ReactDOM.render(
      <Settings
        jiraSubdomain={jiraSubdomain}
        githubURL={githubURL}
        foundDomains={foundDomains}
        onChange={setSubdomain}
        onGithubURLChange={setGithubURL}
        onRequestGithubPermissions={requestGithubPermissions}
      />,
      root
    )
  });

addOnChangedListener(({ jiraSubdomain, githubURL }) => {
  if (jiraSubdomain || githubURL) {
    render();
  }
});

render();
