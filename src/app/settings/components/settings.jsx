import React from 'react';
import cx from 'classnames';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import check from '@fortawesome/fontawesome-free-solid/faCheck';
import times from '@fortawesome/fontawesome-free-solid/faTimes';
import exclaimationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle';

import extractURL from '../../../utilities/extract-url';

const jiraHostPlaceholder = 'Example: https://acme.atlassian.net';

const COLORS = {
  good: '#00d1b2',
  bad: '#ff3860'
};

const VALIDATION_LABELS = {
  blank: { icon: null, message: null },
  permissionGrantedWithCookie: {
    icon: check,
    message: 'Domain permission granted and cookie detected, all good',
    color: COLORS.good
  },
  permissionGrantedNoCookie: {
    icon: exclaimationTriangle,
    message: `Did not detect a cookie, you might not be logged in or there's a typo?`
  },
  permissionDenied: {
    icon: times,
    message: 'No permission to access this host',
    color: COLORS.bad
  }
};

const validateHost = (jiraHost, foundDomains, jiraDomainGranted) => {
  let status;

  if (jiraDomainGranted == false) {
    status = 'permissionDenied';
  } else if (foundDomains.indexOf(extractURL(jiraHost).hostname) !== -1) {
    status = 'permissionGrantedWithCookie';
  } else if (jiraHost && jiraDomainGranted) {
    status = 'permissionGrantedNoCookie';
  } else {
    status = 'blank';
  }

  return VALIDATION_LABELS[status];
};

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pristine: true,
      jiraHost: props.storedJiraHost || ''
    };

    this.onChange = this.onChange.bind(this);
    this.setJiraHost = this.setJiraHost.bind(this);
    this.noLongerPristine = this.noLongerPristine.bind(this);
  }

  setJiraHost(event) {
    event.preventDefault();
    const { jiraHost } = this.state;
    const { origin } = extractURL(jiraHost) || {};

    if (origin) {
      this.setState(
        () => ({ jiraHost: origin }),
        () => this.props.setJiraHost(this.state.jiraHost)
      );
    }
  }

  onChange(event) {
    const {
      target: { value: jiraHost }
    } = event;

    this.setState(() => ({ jiraHost }));
    this.noLongerPristine();
  }

  noLongerPristine() {
    this.setState({ pristine: false });
  }

  currentMode(props) {
    const { jiraHost } = this.state;
    const { foundDomains } = props;
    const { pristine } = this.state;

    switch (true) {
      case !!jiraHost: {
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
    const { storedJiraHost, foundDomains, jiraDomainGranted } = this.props;
    const { jiraHost } = this.state;
    const { icon, message, color } = validateHost(
      jiraHost,
      foundDomains,
      jiraDomainGranted
    );
    const mode = this.currentMode(this.props, this.state);
    const hostChanged = storedJiraHost !== jiraHost;
    const hostPresent = !!jiraHost.length;

    return (
      <div className="section settings">
        <h1 className="title main-title">Settings</h1>

        {mode === 'settings' && (
          <React.Fragment>
            <form className="settings-form" onSubmit={this.setJiraHost}>
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
                    type="submit"
                    disabled={
                      !(hostChanged && hostPresent) && jiraDomainGranted
                    }
                    className={cx('button', {
                      'is-primary':
                        (hostChanged && hostPresent) || !jiraDomainGranted
                    })}
                  >
                    Set Host
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
                  <strong>How this works:</strong> After you entered the host,
                  the extension uses the permission to add your session to Jira
                  API requests.
                </p>
                <p>You must be logged in to Jira for these requests to work.</p>
                <p>This extension does not collect any usage analytics.</p>
              </div>
              <hr />
              <button
                type="button"
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
                style={{ width: '100%' }}
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
