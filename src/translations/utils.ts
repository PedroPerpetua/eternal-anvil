/* eslint-disable import/prefer-default-export */
export function languageNameFromCode(languageCode: string) {
  const nameGenerator = new Intl.DisplayNames(languageCode, { type: 'language' });
  const name = nameGenerator.of(languageCode);
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
}
