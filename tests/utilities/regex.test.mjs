import { pullRequestURL } from '../../src/utilities/regex';
import test from 'tape';

test('matches github pull request with further segments', t => {
  t.plan(1);

  t.true(pullRequestURL.test('https://github.com/daemonsy/jira/pull/15/files'));
});

test('matches github pull request with hashes', t => {
  t.plan(1);

  t.true(pullRequestURL.test('https://github.com/daemonsy/jira/pull/15/files#diff-1d37e48f9ceff6d8030570cd36286a61R41'));
});

test('matches github pull request with queries', t => {
  t.plan(1);

  t.true(pullRequestURL.test('https://github.com/daemonsy/jira/pull/15?test=test'));
});
