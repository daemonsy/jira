const properTicketMatch = /\w+-\d+/;
const dirtyTicketMatch = /^\w+\d+$/;

export default text => {
  switch(true) {
    case properTicketMatch.test(text): {
      return text;
    }

    case dirtyTicketMatch.test(text): {
      return text.replace(/\d{1,5}$/, `-${text.match(/\d{1,5}$/)[0]}`);
    }

    default: {
      return null;
    }
  }
};
