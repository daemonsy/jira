import React from 'react';

const issueURL = ({ jiraSubdomain, key }) =>
  `https://${jiraSubdomain}.atlassian.net/browse/${key}`;

const IssueItem = ({ issue, onClick, jiraSubdomain }) => {
  return (
    <a href={issueURL({ jiraSubdomain, key: issue.key })} className="panel-block" onClick={onClick}>
      <div className="issue-summary">
        {(issue.fields.summary || '').substring(0, 80) + '...'}
      </div>
      <span className="issue-key">{issue.key}</span>
    </a>
  );
}

export default IssueItem;
