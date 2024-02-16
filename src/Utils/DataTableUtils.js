export function highlightMatches(text, searchTerm) {
  //   console.log('🚀 ~ highlightMatches ~ searchTerm:', searchTerm);
  //   console.log('🚀 ~ highlightMatches ~ text:', text);

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text
    .toString()
    .replace(regex, (match) => `<span class="highlight">${match}</span>`);
}
