import React from 'react';

const issueURL = ({ jiraHost, key }) => `${jiraHost}/browse/${key}`;

const IssueItem = ({ issue, onClick, jiraHost }) => {
  return (
    <a
      href={issueURL({ jiraHost, key: issue.key })}
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
