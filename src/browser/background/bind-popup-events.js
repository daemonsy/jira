import { getBrowser } from '../browser';
import { FETCH_JIRA_ISSUES } from '../../config/messages';

const browser = getBrowser();

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === FETCH_JIRA_ISSUES) {
    console.log('fetch jira issues');
  }
});
