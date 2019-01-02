const githubHostPermissions = githubURL => ({
  permissions: ["webRequest", "webRequestBlocking", "tabs"],
  origins: [`*://${githubURL}/*`]
});

export default githubHostPermissions;
