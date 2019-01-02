import bindJiraOmniboxEvents from './chrome/background/bind-jira-omnibox-events';
import bindGithubContentScriptInjectionEvents from './chrome/background/bind-github-content-script-injection-events';

chrome.runtime.onInstalled.addListener(({ reason }, previousVersion, _) => {
  if (reason === 'install') chrome.runtime.openOptionsPage();
});

bindGithubContentScriptInjectionEvents(chrome);
bindJiraOmniboxEvents(chrome);
