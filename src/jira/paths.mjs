import { JIRA_DOMAIN } from '../config/constants';

const textSearchQueryComponent = text =>
  `text ~ "${text}" AND status!="Done" ORDER BY lastViewed DESC`;

const buildQuery = options =>
  Object
    .keys(options)
    .map(key => `${key}=${encodeURIComponent(options[key])}`)
    .join('&')

export const buildBaseURL = subdomain =>
  `https://${subdomain}.${JIRA_DOMAIN}`;

export const apiSearchIssuesPath = (text, { fields = 'summary,status', maxResults = 10 } = {}) =>
  `/rest/api/2/search/?${buildQuery({ fields, maxResults, jql: textSearchQueryComponent(text) })}`;

export const apiIssuePath = (key, { fields = 'summary,status' } = {}) =>
  `/rest/api/2/issue/${key}?${buildQuery({ fields })}`;

export const pageSearchIssuesPath = text =>
  `/issues/?jql=${textSearchQueryComponent(text)}`;

export const buildHelper = (subdomain, pathFunction) =>
  (...args) => buildBaseURL(subdomain) + pathFunction(...args)