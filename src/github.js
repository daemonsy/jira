import React from 'react';
import ReactDOM from 'react-dom';
import JiraBar from './app/github/jira-bar';
import { getClientInstance } from './jira/client';
import { optimisticTicketMatch } from './utilities/ticket-regex';
import { get } from './chrome/storage';

const discussionBoxHeaderSelector = '.js-discussion .timeline-comment-header h3.timeline-comment-header-text';
const headerTitleSelector = '.gh-header-title';
const branchNameSelector = '.head-ref';
const issueCommentSelector = '.js-discussion .js-comment';
const pullRequestNavbarContainerSelector = '.tabnav-pr';

const containerID = `${chrome.runtime.id}-jira-bar`;

const injectJiraBarAboveConversation = (container, { ticketMatches, jiraClient }) => {
  if (ticketMatches.length) {
    ReactDOM.render(
      <JiraBar jiraClient={jiraClient} ticket={ ticketMatches[0] }/>, container);
  }
}

const getTicketMatches = () => {
  return [branchNameSelector, headerTitleSelector, issueCommentSelector]
    .map(selector => document.querySelector(selector))
    .map(element => element && (optimisticTicketMatch.exec(element.innerText) || [])[0])
    .filter(Boolean)
}

const initializeDOM = e => {
  const navbar = document.querySelector(pullRequestNavbarContainerSelector);
  if(!navbar) { return; }
  if(document.getElementById(containerID)) { return; }

  const container = document.createElement('div');
  container.id = containerID;
  navbar.insertAdjacentElement('beforebegin', container);

  get(['jiraSubdomain']).then(({ jiraSubdomain }) => {
    if(!jiraSubdomain) { return; }
    const ticketMatches = getTicketMatches();
    const jiraClient = getClientInstance(jiraSubdomain);

    console.debug('injecting ', container.id);

    injectJiraBarAboveConversation(container, { jiraClient, ticketMatches});
  });
}

initializeDOM();
