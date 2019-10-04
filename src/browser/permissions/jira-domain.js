export default ({ jiraHost }) => ({
  permissions: ['cookies'],
  origins: [`${jiraHost}/*`]
});
