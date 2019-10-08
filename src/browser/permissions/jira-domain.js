export default ({ jiraHost }) => {
  return {
    permissions: ['cookies'],
    origins: [`${jiraHost}/*`]
  };
};
