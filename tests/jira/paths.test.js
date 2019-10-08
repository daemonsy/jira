import test from 'tape';
import {
  buildHelper,
  apiIssuePath,
  apiSearchIssuesPath,
  apiProjectsPath,
  apiProjectPath
} from '../../src/jira/paths';

test('buildHelper returns a URL helper function from the subdomain and a path helper', t => {
  t.plan(1);

  const pathHelper = id => `/issues/${id}`;
  const URLHelper = buildHelper('https://jira.mycorp.net', pathHelper);

  t.equal(URLHelper(13), 'https://jira.mycorp.net/issues/13');
});

test('apiIssuePath returns issues/:key given a key', t => {
  t.plan(1);

  const path = apiIssuePath(99, { fields: 'status' });

  t.equal(path, '/rest/api/2/issue/99?fields=status');
});

test('apiSearchIssuesPath returns /issues?jql=<text for search>', t => {
  t.plan(1);

  const path = apiSearchIssuesPath("this doesn't look like anything to me", {
    fields: 'status',
    maxResults: 5
  });
  const searchString = encodeURIComponent(
    `text ~ "this doesn't look like anything to me" AND status!="Done" ORDER BY lastViewed DESC`
  );

  t.equal(
    path,
    `/rest/api/2/search/?fields=status&maxResults=5&jql=${searchString}`
  );
});

test('apiProjectsPath returns /project?recent=10&projectKeyOrId=LPJ', t => {
  t.plan(1);

  const path = apiProjectsPath('LPJ', { recent: 10 });
  t.equal(path, `/rest/api/2/project?projectKeyOrId=LPJ&recent=10`);
});

test('apiProjectPath returns /project/LPJ', t => {
  t.plan(1);

  const path = apiProjectPath('LPJ');
  t.equal(path, `/rest/api/2/project/LPJ`);
});
