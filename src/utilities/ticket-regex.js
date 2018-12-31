export const projectKeyMatch = /^[A-Z][A-Z0-9_]+$/; // LPJ
export const properTicketMatch = /\w+-\d+/; // LPJ-1234
export const spacedTicketMatch = /\w+\s+\d+/; // LPJ 12345 or LPJ  12345
export const dirtyTicketMatch = /^[A-Z]+\d+$/; // e.g. LPJ1234

export const optimisticTicketMatch = new RegExp(
  `(${properTicketMatch.source})|([A-Z]+\\s+\\d+)|([A-Z]+\\d+)`, 'g'
);
