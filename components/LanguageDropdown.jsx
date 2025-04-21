import React from 'react';

const LANGUAGES = [
  'JavaScript',
  'Python',
  'Java',
  'C',
  'C++',
  'C#',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'TypeScript',
  'Kotlin',
  'Swift',
  'Scala',
  'Dart',
  'Perl',
  'R',
  'Shell',
  'SQL'
];

export default function LanguageDropdown({ value, onChange }) {
  return (
    <select
      className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 font-medium shadow-sm transition"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {LANGUAGES.map(lang => (
        <option key={lang} value={lang}>{lang}</option>
      ))}
    </select>
  );
}
