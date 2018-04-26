const properTicketMatch = /\w+-\d+/; // LPJ-1234
const spacedTicketMatch = /\w+\s+\d+/ // LPJ 12345 or LPJ  12345
const dirtyTicketMatch = /^\w+\d+$/; // e.g. LPJ1234
const digitsOnlyMismatch = /^\d+$/; // e.g. 1065

export default text => {
  switch(true) {
    case digitsOnlyMismatch.test(text): {
      return null;
    }

    case spacedTicketMatch.test(text): {
      return text
        .split(" ")
        .filter(chunk => !!chunk)
        .join("-")
    }

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