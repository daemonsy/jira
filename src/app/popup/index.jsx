import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import cog from '@fortawesome/fontawesome-free-solid/faCog';
import circleNotch from '@fortawesome/fontawesome-free-solid/faCircleNotch';

import './styles.scss';

import Settings from '../settings';
import JiraIssues from '../jira-issues';
import { get, set } from '../../chrome/storage';

const undoneAssignedIssuesURL = ({ jiraSubdomain }) => `https://${jiraSubdomain}.atlassian.net/rest/api/2/search?fields=summary,status&jql=`
  + encodeURIComponent(`assignee=currentuser() AND status!="Done" ORDER BY updated DESC`);

class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jiraSubdomain: props.jiraSubdomain,
      mode: 'issues',
      issuesData: {},
      status: props.jiraSubdomain ? 'launched' : 'noSubdomain',
      error: null
    }
    this.fetchIssues = this.fetchIssues.bind(this);
    this.showSettings = this.showSettings.bind(this);
    this.showIssues = this.showIssues.bind(this);
    this.setSubdomain = this.setSubdomain.bind(this);
  }


  componentDidMount() {
    this.fetchIssues();
  }

  fetchIssues() {
    const { jiraSubdomain } = this.state;

    if (jiraSubdomain) {
      this.setState({ status: 'fetching' });

      fetch(undoneAssignedIssuesURL({ jiraSubdomain }), { credentials: 'same-origin' })
        .then(response => {
          if (!response.ok) { throw new Error(response.status) }
          return response.json()
        })
        .then(issuesData => {
          this.setState({ issuesData, status: 'fetched' });
        }).catch(error => {
          this.setState({ status: 'error', error })
        });
    }
  }

  showSettings() {
    this.setState(state => ({ mode: 'settings' }));
  }

  showIssues() {
    this.fetchIssues();
    this.setState(state => ({ mode: 'issues' }));
  }

  setSubdomain(jiraSubdomain) {
    this.setState({ jiraSubdomain }, () => {
      this.props.setSubdomain(jiraSubdomain);
    });
  }

  render() {
    const {
      jiraSubdomain,
      mode,
      status,
      error,
      issuesData: { issues = [], total }
    } = this.state;

    return (
      <div className="popup">
        {mode === 'settings' &&
          <Settings
            jiraSubdomain={jiraSubdomain}
            onChange={this.setSubdomain}
            done={this.showIssues}
          />
        }
        {mode === 'issues' &&
          <div className="jira-container panel">
            <p className='panel-heading'>
              <span><strong>Jira {mode}</strong></span>
              <button className="settings-button" onClick={this.showSettings}>
                <FontAwesomeIcon icon={cog} />
              </button>
              {status === 'fetched' &&
                <span style={{ float: 'right' }}>
                  {issues.length === total ? `Showing all ${total}` : `Loaded ${issues.length} out of ${total}`}
                </span>
              }
            </p>

            {status === 'fetching' &&
              <div className="message-container has-text-centered">
                <FontAwesomeIcon
                  className="spinner"
                  icon={circleNotch}
                  spin
                />
                <span>Fetching issues...</span>
              </div>
            }

            {status === 'fetched' &&
              <JiraIssues
                chrome={chrome}
                issues={issues}
                jiraSubdomain={jiraSubdomain}
                total={total}
              />
            }

            {status === 'noSubdomain' &&
              <div className="message-container has-text-centered">
                Please enter your Jira subdomain under <a onClick={this.showSettings}>settings</a>.
              </div>
            }

            {status === 'error' &&
              <div className="section message is-danger">
                <div className="message-body">
                  An error occurred while fetching issues. You might not be logged in.

                  Error Status: {error.message}
                </div>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

export default Popup;
