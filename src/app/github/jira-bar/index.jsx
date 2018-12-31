import React from 'react';
import { apiIssuePath, apiTransitionsPath } from '../../../jira/paths.mjs';
import TransitionListItem from './components/transition-list-item';
import uniqBy from 'lodash-es/uniqBy';

const baseStyles = {
  border: '1px solid rgb(209, 213, 218)',
  margin: '1rem 0',
  borderRadius: '3px',
  width: '100%',
  color: '#586069'
}

const headingStyles = {
  backgroundColor: '#f6f8fa'
};

const commonSpacing = {
  padding: '1rem'
};

const statusStyles = {
  marginRight: '0.5rem',
  fontVariant: 'all-small-caps',
  border: '1px solid rgb(209, 213, 218)',
  borderRadius: '3px',
  padding: '0.25rem 0.5rem',
  verticalAlign: 'top' // required by the ellipsis in truncate https://stackoverflow.com/questions/23529369/why-does-x-overflowhidden-cause-extra-space-below
};

const transitionListStyles = {
  display: 'inline-block',
  listStyle: 'none',
  float: 'right',
  marginTop: '-0.25rem'
};

const transitionListItemStyles = {
  display: 'inline-block',
  cursor: 'pointer',
  textAlign: 'center',
  width: '150px'
};

const transitioningListItemStyles = {
  background: '#EEE'
};

const bodyStyles = {
  borderTop: '1px solid rgb(209, 213, 218)'
}

const truncate = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'inline-block'
};

const cardTitleStyles = {
  width: '480px'
};

const avatarStyles = {
  borderRadius: '3px',
  height: '1rem',
  marginRight: '0.25rem',
  marginBottom: '0.1rem'
};

const SHORT_DESCRIPTION_LENGTH = 135;

class JiraBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      issue: null,

      transitions: [],
      bodyExpanded: false
    }
    this.transitionCard = this.transitionCard.bind(this);
    this.getIssue = this.getIssue.bind(this);
    this.toggleExpandHTML = this.toggleExpandHTML.bind(this);
  }

  getIssue() {
    const { jiraClient, ticket } = this.props;

    if(ticket) {
      jiraClient.get(apiIssuePath, ticket, { expand: 'renderedFields', fields: 'summary,status,description,assignee' }).then(issue => {
        this.setState({ issue, transitioning: false }, () => {
          jiraClient.get(apiTransitionsPath, ticket).then(({ transitions }) => {
            this.setState({ transitions: uniqBy(transitions, 'id').slice(-2) });
          });
        });
      });
    }
  }

  transitionCard({ id }) {
    const { transitioning } = this.state;
    const { jiraClient, ticket } = this.props;

    if (!transitioning && ticket) {
      this.setState({ transitioning: true }, () => {
        jiraClient.post(apiTransitionsPath(ticket), { transition: { id } }).then(response => {
          if (response.status >= 200) {
            this.getIssue();
          }
        });
      });
    }
  }

  componentDidMount() {
    this.getIssue();
  }

  toggleExpandHTML(e) {
    e.preventDefault();
    this.setState(state => ({ bodyExpanded: !state.bodyExpanded }))
  }

  render() {
    const { issue, transitions, bodyExpanded, transitioning } = this.state;
    const { jiraClient } = this.props;
    if(!issue) {
      return null;
    }

    const { fields: {
      summary,
      status,
      assignee
    } = {} } = issue;

    const description = issue.fields.description || '';

    const {
      name: assignedUserName,
      avatarUrls: {
        '48x48': avatarUrl
      } = {}
    } = assignee || {};

    return (
      <div className="jira-bar" style={baseStyles}>
        <div style={{...headingStyles, ...commonSpacing}}>
          <span style={statusStyles}>
            { avatarUrl && <img title={assignedUserName} src={avatarUrl} style={avatarStyles}/> }
            { status.name }
          </span>
          <span title={summary} style={{...truncate, ...cardTitleStyles}}>
            <strong><a href={jiraClient.issueURL(issue.key)} target='_blank'>{ issue.key }</a>:</strong> { issue.fields.summary }
          </span>
          <ul style={transitionListStyles}>
            { transitions.map(transition =>
              <TransitionListItem
                key={transition.id}
                transition={transition}
                styles={{...transitionListItemStyles, ...statusStyles, ...truncate, ...(transitioning ? transitioningListItemStyles : {}) }}
                onClick={this.transitionCard}
              />)
            }
          </ul>
        </div>
        { bodyExpanded &&
          <div style={{ ...commonSpacing, ...bodyStyles}}>
            <div dangerouslySetInnerHTML={{ __html: issue.renderedFields.description}} />
            <a href="#" onClick={this.toggleExpandHTML}>- Show summary </a>
          </div>
        }

        { !bodyExpanded &&
          <div style={{ ...commonSpacing, ...bodyStyles}}>
            <p>{description.substring(0, SHORT_DESCRIPTION_LENGTH)}{description.length > SHORT_DESCRIPTION_LENGTH ? "...": null}</p>
            <a href="#" onClick={this.toggleExpandHTML}>+ Show full HTML</a>
          </div>
        }
      </div>
    );
  }
}

export default JiraBar;
