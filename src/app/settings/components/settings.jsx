import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import check from '@fortawesome/fontawesome-free-solid/faCheck';

const subdomainPlaceholder = 'Your Jira subdomain';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.done = this.done.bind(this);
  }

  onChange(event) {
    const { currentTarget: { value } } = event;
    this.props.onChange(value.trim());
  }

  done() {
    this.props.done();
  }

  render() {
    const { jiraSubdomain } = this.props;

    return (
      <div className="section settings">
        <a onClick={this.done}>Back</a>
        <h3 className="title">Settings</h3>
        <form onSubmit={this.done}>
          <div className="field has-addons">
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
                <FontAwesomeIcon icon={check} />
              </span>
            </div>
            <div className="control">
              <a className="button is-static">
                .atlassian.net
              </a>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Settings;
