import { get } from './chrome/storage';
import debounce from 'lodash-es/debounce';
import ticketMatch from './utilities/ticket-match';
import {
  buildHelper,
  apiSearchIssuesPath,
  apiIssuePath,
  pageSearchIssuesPath
} from './jira/paths';

const escapeEntities = (text) => {
  // Dependent on Browser API
  const converter = document.createElement('span');
  converter.textContent = text;
  return converter.innerHTML
}

const messages = {
  defaultPrompt: 'Type in a ticket number or free text to search for issues',
  noSubdomain: 'Jira subdomain needs to be entered. Click here or hit enter to open the Settings page',
  typeMore: 'Nothing yet. Keep typing :)'
};

const makeJiraApiCall = url =>
  fetch(url, { credentials: 'same-origin' })
    .then(response => response.json());

const showDefaultSuggestion = description =>
  chrome.omnibox.setDefaultSuggestion({ description: escapeEntities(description) });

const displayRelevantSuggestions = (input, suggest, subdomain) => {
  const apiSearchIssuesURL = buildHelper(subdomain, apiSearchIssuesPath);

  showDefaultSuggestion(`Search for ${input}...`);
  makeJiraApiCall(apiSearchIssuesURL(input), { credentials: 'same-origin' })
    .then(({ issues = [] }) => {
      const suggestions = issues.map(({ key, fields: { summary } }) => ({
        content: key, description: escapeEntities(`${key}: ${summary}`)
      }));
      suggest(suggestions)
    });
};

const displayTicketSuggestion = (ticket, suggest, subdomain) => {
  const apiIssueURL = buildHelper(subdomain, apiIssuePath);
  const key = ticket.toUpperCase();

  showDefaultSuggestion(`Open ${key}`);
  makeJiraApiCall(apiIssueURL(key)).then(({ fields, key: foundKey, errorMessages = [] } = {}) => {
    if (errorMessages.length) {
      showDefaultSuggestion(`Open ${key}. Heads up, no issue found with this key :(`);
    } else {
      const { summary, status: { name } } = fields;
      suggest([{ content: foundKey, description: escapeEntities(`${foundKey}: [${name}] ${summary}`) }]);
    }
  });
};

const onInputChangedHandler = debounce((input, suggest) => {
  get(['jiraSubdomain']).then(({ jiraSubdomain }) => {
    if (!jiraSubdomain) {
      showDefaultSuggestion(messages.noSubdomain);
      return;
    }
    const ticket = ticketMatch(input);

    if (ticket) {
      displayTicketSuggestion(ticket, suggest, jiraSubdomain);
      return;
    }

    if (input.trim().length > 2) {
      displayRelevantSuggestions(input, suggest, jiraSubdomain);
    } else {
      showDefaultSuggestion(messages.typeMore);
    }
  });
}, 200);

chrome.omnibox.onInputEntered.addListener((input, disposition) => {
  get(['jiraSubdomain']).then(({ jiraSubdomain }) => {
    if (input && !!input.trim() && jiraSubdomain) {
      const ticket = ticketMatch(input);

      let url;
      if (ticket) {
        const key = ticket.toUpperCase();
        url = `https://${jiraSubdomain}.atlassian.net/browse/${key}`;
      } else {
        const pageSearchIssuesURL = buildHelper(jiraSubdomain, pageSearchIssuesPath)
        url = pageSearchIssuesURL(input);
      }

      chrome.tabs.update({ url });
    }
  });
});

chrome.omnibox.onInputChanged.addListener(onInputChangedHandler);
