import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import cog from '@fortawesome/fontawesome-free-solid/faCog';
import circleNotch from '@fortawesome/fontawesome-free-solid/faCircleNotch';

import './styles.scss';

import JiraIssues from '../jira-issues';

const undoneAssignedIssuesURL = ({ jiraHost }) =>
  `${jiraHost}/rest/api/2/search?fields=summary,status&jql=` +
  encodeURIComponent(
    `assignee=currentuser() AND statusCategory != Done AND resolution IS EMPTY ORDER BY updated DESC`
  );

class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jiraHost: props.jiraHost,
      mode: 'issues',
      issuesData: {},
      status: props.jiraHost ? 'launched' : 'noSubdomain',
      error: null
    };
    this.fetchIssues = this.fetchIssues.bind(this);
    this.showSettings = this.showSettings.bind(this);
  }

  componentDidMount() {
    this.fetchIssues();
  }

  fetchIssues() {
    const { jiraHost } = this.state;

    if (jiraHost) {
      this.setState({ status: 'fetching' });

      fetch(undoneAssignedIssuesURL({ jiraHost }), {
        credentials: 'same-origin'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.status);
          }
          return response.json();
        })
        .then(issuesData => {
          this.setState({ issuesData, status: 'fetched' });
        })
        .catch(error => {
          this.setState({ status: 'error', error });
        });
    } else {
      this.setState(state => ({ status: 'noSubdomain' }));
    }
  }

  showSettings() {
    chrome.runtime.openOptionsPage();
  }

  render() {
    const {
      jiraHost,
      mode,
      status,
      error,
      issuesData: { issues = [], total }
    } = this.state;

    return (
      <div className="popup">
        {mode === 'issues' && (
          <div className="jira-container panel">
            <p className="panel-heading">
              <span>
                <strong>Jira {mode}</strong>
              </span>
              <button className="settings-button" onClick={this.showSettings}>
                <FontAwesomeIcon icon={cog} />
              </button>
              {status === 'fetched' && (
                <span style={{ float: 'right' }}>
                  {issues.length === total
                    ? `Showing all ${total}`
                    : `Loaded ${issues.length} out of ${total}`}
                </span>
              )}
            </p>

            {status === 'fetching' && (
              <div className="message-container has-text-centered">
                <FontAwesomeIcon className="spinner" icon={circleNotch} spin />
                <span>Fetching issues...</span>
              </div>
            )}

            {status === 'fetched' && (
              <JiraIssues
                chrome={chrome}
                issues={issues}
                jiraHost={jiraHost}
                total={total}
              />
            )}

            {status === 'noSubdomain' && (
              <div className="message-container has-text-centered">
                <span>
                  Please enter your Jira subdomain under{' '}
                  <a onClick={this.showSettings}>Settings</a>.
                </span>
              </div>
            )}

            {status === 'error' && (
              <div className="section message is-danger">
                <div className="message-body">
                  An error occurred while fetching issues. You might not be
                  logged in. Error Status: {error.message}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Popup;
