import { projectKeyMatch, properTicketMatch, spacedTicketMatch, dirtyTicketMatch } from './ticket-regex';

export default text => {
  switch (true) {

    case spacedTicketMatch.test(text): {
      return {
        type: 'issue',
        text: text
          .split(' ')
          .filter(chunk => !!chunk)
          .join('-')
      };
    }

    case properTicketMatch.test(text): {
      return {
        type: 'issue',
        text
      };
    }

    case dirtyTicketMatch.test(text): {
      return {
        type: 'issue',
        text: text.replace(/\d{1,5}$/, `-${text.match(/\d{1,5}$/)[0]}`)
      };
    }

    case projectKeyMatch.test(text): {
      return {
        type: 'project',
        text
      };
    }

    default: {
      return { type: null, text: null };
    }
  }
};
