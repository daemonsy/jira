import { JIRA_DOMAIN } from '../../config/constants';

const githubFeaturePermissions = ({ githubURL }) => ({
  permissions: ["webRequest", "webRequestBlocking", "tabs"],
  origins: [`*://${githubURL}/*`]
});

export default githubFeaturePermissions;
