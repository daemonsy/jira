import { get } from './chrome/storage';
import ticketMatch from './utilities/ticket-match';

import { JIRA_DOMAIN } from './config/constants';

const searchIssuesURL = (jiraSubdomain, text) =>
  `https://${jiraSubdomain}.${JIRA_DOMAIN}/issues/?jql=`
  + encodeURIComponent(`text ~ "${text}" order by lastViewed DESC`);

chrome.omnibox.onInputEntered.addListener((input, disposition) => {
  get(['jiraSubdomain']).then(({ jiraSubdomain }) => {
    if (input && !!input.trim() && jiraSubdomain) {
      const ticket = ticketMatch(input);

      let url;
      if (ticket) {
        url = `https://${jiraSubdomain}.atlassian.net/browse/${ticket.toUpperCase()}`;
      } else {
        url = searchIssuesURL(jiraSubdomain, input);
      }

      chrome.tabs.update({ url });
    }
  });
});


