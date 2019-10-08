export default possibleURL => {
  let cleanedValue = (possibleURL || '').trim();

  cleanedValue = cleanedValue.startsWith('http')
    ? cleanedValue
    : `https://${cleanedValue}`;

  try {
    return new URL(cleanedValue);
  } catch {
    return {};
  }
};
