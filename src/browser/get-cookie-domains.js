import { JIRA_DOMAIN } from '../config/constants';
import getBrowser from './get-browser';

const exceptBasedomain = ({ domain }) =>
  domain !== `.${JIRA_DOMAIN}` &&
  domain !== `ecosystem.${JIRA_DOMAIN}` &&
  domain !== `jira.${JIRA_DOMAIN}` &&
  domain !== '';

export default async domain => {
  const cookies = await new Promise((resolve, reject) => {
    const browser = getBrowser();
    if (!browser.cookies || !domain) {
      resolve([]);
    }

    browser.cookies.getAll({ domain }, cookies => {
      console.log(cookies);
      resolve(cookies);
    });
  });

  return [
    ...new Set(cookies.filter(exceptBasedomain).map(cookie => cookie.domain))
  ];
};
