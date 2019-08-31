export default ({ jiraHost }) => ({
  permissions: ['cookies', 'storage'],
  origins: [`${jiraHost}/*`]
});
