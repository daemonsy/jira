import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import check from '@fortawesome/fontawesome-free-solid/faCheck';
import times from '@fortawesome/fontawesome-free-solid/faTimes';
import exclaimationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle';
import PropTypes from 'prop-types';

const subdomainPlaceholder = 'Jira subdomain, e.g. twilio';
const githubURLPlaceholder = 'Github URL, e.g. github.com';

const validationMessages = {
  match: "Looks good, detected a cookie at this subdomain",
  goodNoCookie: "Did not detect a cookie for this subdomain. Check for typos or you might not be logged in to Jira.",
  bad: "The subdomain is invalid. If the organization URL is acme.atlassian.net, only enter acme.",
  blank: "Please enter your Jira subdomain"
};

const validationIcons = {
  match: check,
  goodNoCookie: exclaimationTriangle,
  bad: times,
  blank: null,
};

const validationColors = {
  match: '#00d1b2',
  bad: '#ff3860'
}

const validateSubdomain = (jiraSubdomain, foundDomains) => {
  let status = 'bad';

  if (!jiraSubdomain) {
    status = 'blank';
  } else if (foundDomains.indexOf(jiraSubdomain) !== -1) {
    status = 'match';
  } else if (/^\w+\b$/.test(jiraSubdomain)) {
    status = 'goodNoCookie';
  };

  return {
    icon: validationIcons[status],
    message: validationMessages[status],
    color: validationColors[status]
  };
}
class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pristine: true
    };

    this.onChange = this.onChange.bind(this);
    this.noLongerPristine = this.noLongerPristine.bind(this);
    this.onGithubURLChange = this.onGithubURLChange.bind(this);
    this.onRequestGithubPermissions = this.onRequestGithubPermissions.bind(this);
  }

  onChange(event) {
    const { target: { value } } = event;

    this.props.onChange(value.trim());
    this.noLongerPristine();
  }

  onGithubURLChange(event) {
    const { target: { value } } = event;
    event.preventDefault();
    this.props.onGithubURLChange(value.trim());
  }

  onRequestGithubPermissions(event) {
    event.preventDefault();
    this.props.onRequestGithubPermissions();
  }

  noLongerPristine() {
    this.setState({ pristine: false });
  }

  currentMode(props) {
    const { jiraSubdomain, foundDomains } = props;
    const { pristine } = this.state;

    switch (true) {
      case !!jiraSubdomain: {
        return 'settings';
      }

      case pristine && foundDomains.length == 1: {
        return 'wizard';
      }

      default: {
        return 'settings';
      }
    }
  }

  render() {
    const { jiraSubdomain, foundDomains, githubURL } = this.props;
    const { icon, color, message } = validateSubdomain(jiraSubdomain, foundDomains);
    const mode = this.currentMode(this.props, this.state);

    return (
      <div className="section settings">
        <h1 className="title main-title">Jira Settings</h1>

        { mode === 'settings' &&
          <React.Fragment>
            <form className="settings-form">
              <h4 className="title is-size-4">Subdomain</h4>
              <div className="field has-addons" style={{ flexWrap: 'wrap' }}>
                <div className="control">
                  <a className="button is-static">
                    https://
                  </a>
                </div>
                <div className="control has-icons-right is-expanded">
                  <input
                    name="jiraSubdomain"
                    type="text"
                    className="input has-text-right"
                    placeholder={subdomainPlaceholder}
                    value={jiraSubdomain || ''}
                    onChange={this.onChange}
                  />
                  { icon &&
                    <span className="icon is-right">
                      <FontAwesomeIcon icon={icon} color={color} />
                    </span>
                  }
                </div>
                <div className="control is-expanded">
                  <a className="button is-static">
                    .atlassian.net
                  </a>
                </div>
                { message &&
                  <p className="help">{message}</p>
                }
              </div>
              <hr/>
              <h4 className="title is-size-4">Github Integration</h4>
              <p>Enter your Github URL to show pull out Jira card information in a pull request</p>
              <div className="field has-addons" style={{ flexWrap: 'wrap' }}>
                <div className="control">
                  <a className="button is-static">
                    https://
                  </a>
                </div>
                <div className="control is-expanded">
                  <input
                    name="githubURL"
                    type="text"
                    className="input has-text-right"
                    placeholder={githubURLPlaceholder}
                    value={githubURL || ''}
                    onChange={this.onGithubURLChange}
                  />
                </div>
                <div className="control">
                  <a className="button is-primary" onClick={this.onRequestGithubPermissions}>
                    Grant Access
                  </a>
                </div>
              </div>
              <button
                onClick={window.close}
                className="is-primary button is-medium close-button"
              >Close this page</button>
            </form>
            <div className="muted">
              <p><strong>Quick Start:</strong> Type <code>j</code>, then <code>tab</code>, type in a issue key (HSI-123) or free text to search. You must be logged in to Jira.</p>
              <p><strong>How this works:</strong> After you entered the subdomain, this extension makes API requests to <code>your-domain.atlassian.net</code> using same origin cookies.</p>
              <p>Permission to <code>*.atlassian.net</code> is required for same origin Jira API requests.</p>
            </div>
          </React.Fragment>
        }

        { mode === 'wizard' &&
          <div className="wizard has-text-centered">
            <div>
              <p className='message'>
                This extension needs your Jira subdomain to work.
                Is your organization at <strong>{foundDomains[0]}</strong>.atlassian.net?
              </p>
              <button
                className="button is-primary is-medium"
                onClick={this.onChange}
                value={foundDomains[0]}
                style={{ width: '100% '}}>
                Yes, set it to {foundDomains[0]}
              </button>
              <a onClick={this.noLongerPristine}>No, I'll enter it myself.</a>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Settings;
