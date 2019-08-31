import React from 'react';
import cx from 'classnames';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import check from '@fortawesome/fontawesome-free-solid/faCheck';
import times from '@fortawesome/fontawesome-free-solid/faTimes';
import exclaimationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle';

import extractURLHost from '../../../utilities/extract-url-host';

const jiraHostPlaceholder = 'Example: https://acme.atlassian.net';

const validationMessages = {
  match: 'Looks good, detected a cookie at this subdomain',
  goodNoCookie:
    'Did not detect a cookie for this subdomain. Check for typos or you might not be logged in to Jira.',
  bad:
    'The subdomain is invalid. If the organization URL is acme.atlassian.net, only enter acme.',
  blank: 'Please enter your Jira subdomain'
};

const validationIcons = {
  match: check,
  goodNoCookie: exclaimationTriangle,
  bad: times,
  blank: null
};

const validationColors = {
  match: '#00d1b2',
  bad: '#ff3860'
};

const validateHost = (jiraHost, foundDomains) => {
  let status = 'bad';

  if (!jiraHost) {
    status = 'blank';
  } else if (foundDomains.indexOf(jiraHost) !== -1) {
    status = 'match';
  } else if (extractURLHost(jiraHost)) {
    status = 'goodNoCookie';
  }

  return {
    icon: validationIcons[status],
    message: validationMessages[status],
    color: validationColors[status]
  };
};

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pristine: true,
      jiraHost: props.storedJiraHost
    };

    this.onChange = this.onChange.bind(this);
    this.setJiraHost = this.setJiraHost.bind(this);
    this.noLongerPristine = this.noLongerPristine.bind(this);
  }

  setJiraHost() {
    const { jiraHost } = this.state;
    const hostname = extractURLHost(jiraHost);

    if (hostname) {
      this.setState(
        () => ({ jiraHost: hostname }),
        () => this.props.setJiraHost(this.state.jiraHost)
      );
    }
  }

  onChange(event) {
    const {
      target: { value }
    } = event;

    this.setState(() => ({ jiraHost: value }));
    this.noLongerPristine();
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
    const { storedJiraHost, foundDomains } = this.props;
    const { jiraHost } = this.state;
    const { icon, message, color } = validateHost(jiraHost, foundDomains);
    const mode = this.currentMode(this.props, this.state);
    const hostChanged = storedJiraHost !== jiraHost;

    return (
      <div className="section settings">
        <h1 className="title main-title">Settings</h1>

        {mode === 'settings' && (
          <React.Fragment>
            <form className="settings-form">
              <h4 className="title is-size-4">Jira Host</h4>
              <p className="help">
                <strong>Paste any Jira URL</strong> into the box or type in your
                Jira host
              </p>
              <div className="field has-addons" style={{ flexWrap: 'wrap' }}>
                <div className="control has-icons-right is-expanded">
                  <input
                    name="jiraHost"
                    type="text"
                    className="input has-text-right"
                    placeholder={jiraHostPlaceholder}
                    value={jiraHost}
                    onChange={this.onChange}
                  />
                  {icon && (
                    <span className="icon is-right">
                      <FontAwesomeIcon icon={icon} color={color} />
                    </span>
                  )}
                </div>
                <div className="control">
                  <button
                    disabled={!hostChanged}
                    type="button"
                    onClick={this.setJiraHost}
                    className={cx('button', {
                      'is-primary': hostChanged
                    })}
                  >
                    {hostChanged ? (
                      'Set Host'
                    ) : (
                      <FontAwesomeIcon
                        icon={check}
                        color={validationColors['match']}
                      />
                    )}
                  </button>
                </div>
                {message && <p className="help">{message}</p>}
              </div>
              <div className="muted">
                <p>
                  <strong>Quick Start:</strong> Type <code>j</code>, then{' '}
                  <code>tab</code>, type in a issue key (HSI-123) or free text
                  to search. You must be logged in to Jira.
                </p>
                <p>
                  <strong>How this works:</strong> After you entered the
                  subdomain, this extension makes API requests to{' '}
                  <code>your-domain.atlassian.net</code> using same origin
                  cookies.
                </p>
                <p>
                  Permission to <code>*.atlassian.net</code> is required for
                  same origin Jira API requests.
                </p>
              </div>
              <hr />
              <button
                onClick={window.close}
                className="button is-medium close-button"
              >
                Close this page
              </button>
            </form>
          </React.Fragment>
        )}

        {mode === 'wizard' && (
          <div className="wizard has-text-centered">
            <div>
              <p className="message">
                This extension needs your Jira subdomain to work. Is your
                organization at <strong>{foundDomains[0]}</strong>
                .atlassian.net?
              </p>
              <button
                className="button is-primary is-medium"
                onClick={this.onChange}
                value={foundDomains[0]}
                style={{ width: '100% ' }}
              >
                Yes, set it to {foundDomains[0]}
              </button>
              <a onClick={this.noLongerPristine}>No, I'll enter it myself.</a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Settings;
