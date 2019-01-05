
import { get } from '../storage';
import { pullRequestURL } from '../../utilities/regex';
import githubFeaturePermissions from '../permissions/github-feature';

let executingInjections = {};

const injectContentScriptHandler = (tabId, changes, tab) => {
  get(['githubURL']).then(({ githubURL }) => {
    if (!githubURL || changes.status !== 'complete') return;
    if (tab.url.includes(githubURL) && pullRequestURL.test(tab.url) && !executingInjections[tabId]) {
      executingInjections[tabId] = true;
      chrome.tabs.executeScript({ file: 'github.js' }, () => executingInjections[tabId] = false);
    }
  });
};

const jiraAPIInterceptHandler = ({ requestHeaders }) => {
  const extensionUserAgent = `chrome-jira-extension-${chrome.runtime.id}`;
  const userAgent = requestHeaders.find(header => header.name === 'User-Agent');
  userAgent.value = extensionUserAgent;

  return { requestHeaders };
};

const manageGithubInjectLifecycle = ({ githubURL }) => {
  const hasExistingListener = chrome.tabs.onUpdated.hasListener(injectContentScriptHandler);
  chrome.permissions.contains(githubFeaturePermissions({ githubURL }), result => {
    if(githubURL && !hasExistingListener && result) {
      chrome.tabs.onUpdated.addListener(injectContentScriptHandler);
    }

    if((!githubURL || !result) && hasExistingListener) {
      chrome.tabs.onUpdated.removeListener(injectContentScriptHandler);
    }
  });
};

const manageJiraAPIInterceptLifecycle = () => {
  get(['githubURL', 'jiraSubdomain']).then(({ githubURL, jiraSubdomain }) => {
    if(!jiraSubdomain || !githubURL ) return;
    const filter = { urls: [`https://${jiraSubdomain}.atlassian.net/rest/api/*`] };
    const extraInfo = ['blocking', 'requestHeaders'];

    chrome.permissions.contains(githubFeaturePermissions({ githubURL }), results => {
      if(results) {
        chrome.webRequest.onBeforeSendHeaders
          .addListener(jiraAPIInterceptHandler, filter, extraInfo)
      } else {
        chrome.webRequest && chrome.webRequest.onBeforeSendHeaders.removeListener(jiraAPIInterceptHandler);
      }

      manageGithubInjectLifecycle({ githubURL })
    });
  });
};

export default chrome => {
  chrome.storage.onChanged
    .addListener(({ githubURL: { newValue: githubURL } = {}}, namespace) => manageGithubInjectLifecycle({ githubURL }));

  chrome.permissions.onAdded.addListener(manageJiraAPIInterceptLifecycle);

  chrome.permissions.onRemoved.addListener(manageJiraAPIInterceptLifecycle);

  get(['githubURL'])
    .then(({ githubURL }) => manageGithubInjectLifecycle({ githubURL }));
};
