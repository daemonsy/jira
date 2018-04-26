import { JIRA_DOMAIN } from '../config/constants';

const exceptBasedomain = ({ domain }) =>
  domain !== `.${JIRA_DOMAIN}` &&
  domain !== `ecosystem.${JIRA_DOMAIN}` &&
  domain !== '';

export default async () => {
  const cookies = await new Promise((resolve, reject) => {
    chrome.cookies.getAll({ domain: JIRA_DOMAIN }, cookies => {
      resolve(cookies);
    })
  });

  return [
    ...new Set(cookies.filter(exceptBasedomain)
      .map(cookie => cookie.domain
      .split('.')[0]))
  ];
}
