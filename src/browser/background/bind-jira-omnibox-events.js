import { get } from '../storage';
import debounce from 'lodash-es/debounce';
import ticketMatch from '../../utilities/ticket-match';
import {
  buildHelper,
  apiSearchIssuesPath,
  apiIssuePath,
  apiProjectPath,
  pageSearchIssuesPath,
  pageIssuePath,
  pageProjectPath
} from '../../jira/paths';

export default chrome => {
  const escapeEntities = text => {
    // Dependent on Browser API
    const converter = document.createElement('span');
    converter.textContent = text;
    return converter.innerHTML;
  };

  const messages = {
    defaultPrompt: 'Type in a ticket number or free text to search for issues',
    noSubdomain:
      'Jira subdomain needs to be entered. Click here or hit enter to open the Settings page',
    typeMore: 'Nothing yet. Keep typing :)'
  };

  const makeJiraApiCall = url =>
    fetch(url, { credentials: 'same-origin' }).then(response =>
      response.json()
    );

  const showDefaultSuggestion = description =>
    chrome.omnibox.setDefaultSuggestion({
      description: escapeEntities(description)
    });

  const displayRelevantSuggestions = (input, suggest, subdomain) => {
    const apiSearchIssuesURL = buildHelper(subdomain, apiSearchIssuesPath);

    showDefaultSuggestion(`Search for ${input}...`);
    makeJiraApiCall(apiSearchIssuesURL(input)).then(({ issues = [] }) => {
      const suggestions = issues.map(({ key, fields: { summary } }) => ({
        content: key,
        description: escapeEntities(`${key}: ${summary}`)
      }));
      suggest(suggestions);
    });
  };

  const displayProjectSuggestion = (key, suggest, subdomain) => {
    const apiProjectURL = buildHelper(subdomain, apiProjectPath);
    showDefaultSuggestion(`Open project ${key}`);
    makeJiraApiCall(apiProjectURL(key)).then(
      ({ name, key: foundKey, description, errorMessages = [] }) => {
        if (errorMessages.length) {
          showDefaultSuggestion(
            `Open project ${key}. Heads up, no project found with this key :(`
          );
        } else {
          showDefaultSuggestion(
            escapeEntities(
              `Open project ${foundKey}: ${[name, description]
                .filter(Boolean)
                .join(' - ')}`
            )
          );
        }
      }
    );
  };

  const displayTicketSuggestion = (key, suggest, subdomain) => {
    const apiIssueURL = buildHelper(subdomain, apiIssuePath);
    showDefaultSuggestion(`Open issue ${key}`);
    makeJiraApiCall(apiIssueURL(key)).then(
      ({ fields, key: foundKey, errorMessages = [] } = {}) => {
        if (errorMessages.length) {
          showDefaultSuggestion(
            `Open issue ${key}. Heads up, no issue found with this key :(`
          );
        } else {
          const {
            summary,
            status: { name }
          } = fields;
          showDefaultSuggestion(
            escapeEntities(`Open issue ${foundKey}: [${name}] ${summary}`)
          );
        }
      }
    );
  };

  const onInputChangedHandler = debounce((rawInput, suggest) => {
    get(['jiraSubdomain']).then(({ jiraSubdomain }) => {
      const input = (rawInput || '').trim().toUpperCase();

      if (!jiraSubdomain) {
        showDefaultSuggestion(messages.noSubdomain);
        return;
      }

      const { type, text } = ticketMatch(input);
      switch (type) {
        case 'issue': {
          return displayTicketSuggestion(text, suggest, jiraSubdomain);
        }

        case 'project': {
          return displayProjectSuggestion(text, suggest, jiraSubdomain);
        }
      }
      if (input.length > 2) {
        displayRelevantSuggestions(input, suggest, jiraSubdomain);
      } else {
        showDefaultSuggestion(messages.typeMore);
      }
    });
  }, 200);

  chrome.omnibox.onInputEntered.addListener((input, disposition) => {
    get(['jiraSubdomain']).then(({ jiraSubdomain }) => {
      if (!jiraSubdomain) {
        chrome.runtime.openOptionsPage();
        return;
      }

      if (input && !!input.trim() && jiraSubdomain) {
        const key = input.trim().toUpperCase();
        const { type, text } = ticketMatch(key);

        let url;
        switch (type) {
          case 'issue': {
            const pageIssueURL = buildHelper(jiraSubdomain, pageIssuePath);
            url = pageIssueURL(text);
            break;
          }

          case 'project': {
            const pageProjectURL = buildHelper(jiraSubdomain, pageProjectPath);
            url = pageProjectURL(text);
            break;
          }

          default: {
            const pageSearchIssuesURL = buildHelper(
              jiraSubdomain,
              pageSearchIssuesPath
            );
            url = pageSearchIssuesURL(input);
          }
        }
        chrome.tabs.update({ url });
      }
    });
  });

  chrome.omnibox.onInputChanged.addListener(onInputChangedHandler);
};
