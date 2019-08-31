import React from 'react';
import { JIRA_DOMAIN } from '../../../config/constants';

const issueURL = ({ jiraSubdomain, key }) =>
  `https://${jiraSubdomain}.${JIRA_DOMAIN}/browse/${key}`;

const IssueItem = ({ issue, onClick, jiraSubdomain }) => {
  return (
    <a
      href={issueURL({ jiraSubdomain, key: issue.key })}
      className="panel-block"
      onClick={onClick}
    >
      <div className="issue-summary">
        {(issue.fields.summary || '').substring(0, 80) + '...'}
      </div>
      <span className="issue-key">{issue.key}</span>
    </a>
  );
};

export default IssueItem;
