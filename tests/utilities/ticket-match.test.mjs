import match from '../../src/utilities/ticket-match';
import test from 'tape';

test('matches ADM1011', t => {
  t.plan(1);
  t.equal(match('ADM1011'), 'ADM-1011');
});

test('matches ADM-2011', t => {
  t.plan(1);
  t.equal(match('ADM-2011'), 'ADM-2011');
});

test('matches ADM1-1011', t => {
  // Keys for Jira projects can have numbers
  t.plan(1);

  t.equal(match('ADM1-1011'), 'ADM1-1011');
});

test('does not match 1011', t => {
  t.plan(1);

  t.equal(match('1011'), null);
});

test('matches ADM 1234', t => {
  t.plan(1);

  t.equal(match('ADM 1234'), 'ADM-1234');
});

test('matches ADM   1234', t => {
  t.plan(1);

  t.equal(match('ADM   1234'), 'ADM-1234');
});
