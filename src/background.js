import bindJiraOmniboxEvents from './browser/background/bind-jira-omnibox-events';

chrome.runtime.onInstalled.addListener(({ reason }, previousVersion, _) => {
  if (reason === 'install') chrome.runtime.openOptionsPage();
});

bindJiraOmniboxEvents(chrome);
