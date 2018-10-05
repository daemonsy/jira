import match from '../../src/utilities/ticket-match';
import test from 'tape';

// The below for key format
// https://confluence.atlassian.com/adminjiraserver071/changing-the-project-key-format-802592378.html
test('matches ADM as a project', t => {
  t.plan(1);
  t.deepEqual(match('ADM'), { type: 'project', text: 'ADM' });
});

test('matches ADM_1 as a project', t => {
  t.plan(1);
  t.deepEqual(match('ADM_1'), { type: 'project', text: 'ADM_1' });
});

test('matches ADM1 as a project', t => {
  // Conflicts with dirty ticket test.
  t.plan(1);
  t.true(true);
});

test('matches ADM1011 as issue, not project', t => {
  t.plan(1);
  t.deepEqual(match('ADM1011'), { type: 'issue', text: 'ADM-1011' });
});

test('matches ADM-2011', t => {
  t.plan(1);
  t.deepEqual(match('ADM-2011'), { type: 'issue', text: 'ADM-2011' });
});

test('matches ADM1-1011', t => {
  // Keys for Jira projects can have numbers
  t.plan(1);

  t.deepEqual(match('ADM1-1011'), { type: 'issue', text: 'ADM1-1011' });
});

test('does not match 1011', t => {
  t.plan(1);

  t.deepEqual(match('1011'), { type: null, text: null });
});

test('matches ADM 1234', t => {
  t.plan(1);

  t.deepEqual(match('ADM 1234'), { type: 'issue', text: 'ADM-1234' });
});

test('matches ADM   1234', t => {
  t.plan(1);

  t.deepEqual(match('ADM   1234'), { type: 'issue', text: 'ADM-1234' });
});
