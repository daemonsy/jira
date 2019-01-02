
import { get } from '../storage';
import { pullRequestURL } from '../../utilities/regex';
import githubHostPermissions from '../permissions/github-host';

const injectContentScriptHandler = (tabId, { status }, tab) => {
  get(['githubURL']).then(({ githubURL }) => {
    if (!githubURL || status !== 'complete') return;
    if (tab.url.includes(githubURL) && pullRequestURL.test(tab.url)) {
      console.debug('Injecting on ', tab.url);
      chrome.tabs.executeScript({ file: 'github.js' });
    }
  });
}

const manageGithubInjectLifecycle = githubURL => {
  const hasExistingListener = chrome.tabs.onUpdated.hasListener(injectContentScriptHandler);
  chrome.permissions.contains(githubHostPermissions(githubURL), result => {
    if(githubURL && !hasExistingListener && result) {
      console.log('add listener');
      chrome.tabs.onUpdated.addListener(injectContentScriptHandler);
    }

    if((!githubURL || !result) && hasExistingListener) {
      console.log('remove listner');
      chrome.tabs.onUpdated.removeListener(injectContentScriptHandler);
    }
  });
}

export default chrome => {
  const extensionUserAgent = `chrome-jira-extension-${chrome.runtime.id}`;

  chrome.storage.onChanged.addListener(({ githubURL: { newValue: githubURL } = {}}, namespace) => manageGithubInjectLifecycle(githubURL));

  get(['githubURL']).then(({ githubURL }) => manageGithubInjectLifecycle(githubURL));

  get(['jiraSubdomain']).then(({ jiraSubdomain }) => {
    chrome.webRequest.onBeforeSendHeaders.addListener(({ requestHeaders }) => {
      const userAgent = requestHeaders.find(header => header.name === 'User-Agent');
      userAgent.value = extensionUserAgent;
      return { requestHeaders };
    }, { urls: [`https://${jiraSubdomain}.atlassian.net/rest/api/*`] }, ['blocking', 'requestHeaders']);
  });
};
