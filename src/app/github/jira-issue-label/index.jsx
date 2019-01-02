import React from 'react';
import { apiIssuePath } from '../../../jira/paths.mjs';

// Copied from document.querySelector('.js-discussion .timeline-comment-header span.timeline-comment-label')
const classes = 'timeline-comment-label text-bold tooltipped tooltipped-multiline tooltipped-s';

class JiraIssueLabel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      issue: null
    }

    this.goToTicket = this.goToTicket.bind(this);
  }

  goToTicket() {
    const { ticket, jiraClient } = this.props;
    const { issue } = this.state;
    const url = jiraClient.issueURL(issue ? issue.key : ticket);

    location.href = url;
  }

  componentDidMount() {
    const { jiraClient, ticket } = this.props;

    jiraClient.get(apiIssuePath, ticket).then(issue => {
      this.setState({ issue });
    })
  }

  render() {
    const { ticket } = this.props;
    const { issue } = this.state;

    return (
      ticket ? <span
        className={classes}
        onClick={this.goToTicket}
        aria-label={ issue ? issue.fields.summary : null }
      >
        View {ticket}
      </span> : null
    )
  }
}

export default JiraIssueLabel;
