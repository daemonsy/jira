import { buildHelper, buildBaseURL } from './paths';

export const getClientInstance = jiraSubdomain => {
  return {
    get(path, ...args) {
      const urlHelper = buildHelper(jiraSubdomain, path);

      return fetch(urlHelper.apply(undefined, args), { credentials: 'same-origin' })
        .then(response => response.json());
    },

    post(path, body) {
      const url = `${buildBaseURL(jiraSubdomain)}${path}`;
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Origin': `https://${jiraSubdomain}.atlassian.net`,
        'User-Agent': 'jira/extension/2.0'
      });

      return fetch(url, {
        credentials: 'same-origin',
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })
    },

    issueURL(key) {
      return `https://${jiraSubdomain}.atlassian.net/browse/${key}`;
    }

  }
}
