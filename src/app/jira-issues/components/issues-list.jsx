import React from 'react';

import IssueItem from './issue-item';
import './styles.scss';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';

const searchFilter = (issues, text) => {
  const cleanedText = text.trim().toLowerCase();

  const results = cleanedText
    ? issues.filter(
        issue =>
          issue.fields.summary.toLowerCase().indexOf(cleanedText) !== -1 ||
          issue.key.toLowerCase().indexOf(cleanedText) !== -1
      )
    : issues;

  return results;
};

class IssuesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: ''
    };

    this.openIssue = this.openIssue.bind(this);
    this.filterIssues = this.filterIssues.bind(this);
  }

  openIssue(event) {
    const { chrome } = this.props;

    chrome.tabs.create({ url: event.currentTarget.href });
  }

  filterIssues(event) {
    const {
      currentTarget: { value }
    } = event;

    this.setState({ filter: value });
  }

  render() {
    const { filter } = this.state;
    const { issues, jiraHost } = this.props;

    return (
      <div className="issues-list">
        <div className="panel-block">
          <p className="control has-icons-left">
            <input
              className="input is-small"
              type="text"
              placeholder="Filter..."
              onChange={this.filterIssues}
              autoFocus
            />
            <span className="icon is-small is-left">
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </p>
        </div>

        {searchFilter(issues, filter).map(issue => (
          <IssueItem
            key={issue.key}
            issue={issue}
            onClick={this.openIssue}
            jiraHost={jiraHost}
          />
        ))}
      </div>
    );
  }
}

IssuesList.defaultProps = {
  issues: [],
  total: 0
};

export default IssuesList;
