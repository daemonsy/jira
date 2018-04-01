import { get } from './chrome/storage';

const properTicketMatch = /\w+-\d+/;
const dirtyNumberMatch = /\d{1,4}$/;

const parseTicket = ticket => {
  switch (true) {
    case properTicketMatch.test(ticket): {
      return ticket;
    }

    case dirtyNumberMatch.test(ticket): {
      return ticket.replace(dirtyNumberMatch, `-${ticket.match(dirtyNumberMatch)[0]}`);
    }

    default: {
      return ticket;
    }
  }
}

chrome.omnibox.onInputEntered.addListener((input, disposition) => {
  get(['jiraSubdomain']).then(({ jiraSubdomain }) => {
    if (input && !!input.trim() && jiraSubdomain) {
      const ticket = parseTicket(input);

      chrome.tabs.update({ url: `https://${jiraSubdomain}.atlassian.net/browse/${ticket.toUpperCase()}` });
    }
  });
});


