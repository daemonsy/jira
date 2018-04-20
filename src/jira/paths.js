import { JIRA_DOMAIN } from '../config/constants';

const textSearchQueryComponent = text =>
  encodeURIComponent(`text ~ "${text}" AND status!="Done" ORDER BY lastViewed DESC`);

export const buildBaseURL = subdomain =>
  `https://${subdomain}.${JIRA_DOMAIN}`;

export const apiSearchIssuesPath = text =>
  `/rest/api/2/search/?fields=summary,status&maxResults=10&jql=${textSearchQueryComponent(text)}`;

export const apiIssuePath = key =>
  `/rest/api/2/issue/${key}?fields=status,summary`;

export const pageSearchIssuesPath = text =>
  `/issues/?jql=${textSearchQueryComponent(text)}`;

export const build = (subdomain, pathFunction) =>
  (...args) => buildBaseURL(subdomain) + pathFunction(...args)
