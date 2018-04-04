import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import check from '@fortawesome/fontawesome-free-solid/faCheck';
import times from '@fortawesome/fontawesome-free-solid/faTimes';
import exclaimationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle';

const subdomainPlaceholder = 'Jira subdomain, e.g. twilio';

const validationMessages = {
  match: null,
  goodNoCookie: "Did not detect a cookie for this subdomain. Check for typos or you might not be logged in to Jira.",
  bad: "The subdomain doesn't look right. If your organization URL is acme.atlassian.net, only enter acme.",
  blank: "Please enter your subdomain"
};

const validationIcons = {
  match: check,
  goodNoCookie: exclaimationTriangle,
  bad: times
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

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const { currentTarget: { value } } = event;
    this.props.onChange(value.trim());
  }

  render() {
    const { jiraSubdomain, foundDomains, done } = this.props;
    const { icon, color, message } = validateSubdomain(jiraSubdomain, foundDomains);

    return (
      <div className="section settings">
        <a onClick={done}>Back</a>
        <h3 className="title">Settings</h3>

        <form onSubmit={done}>
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
                value={jiraSubdomain}
                onChange={this.onChange}
              />
              <span className="icon is-right">
                <FontAwesomeIcon icon={icon} color={color} />
              </span>
            </div>
            <div className="control is-expanded">
              <a className="button is-static">
                .atlassian.net
              </a>
            </div>
            { message &&
              <p className="help" style={{ width: '100%' }}>{message}</p>
            }
          </div>
        </form>
      </div>
    );
  }
}

export default Settings;
