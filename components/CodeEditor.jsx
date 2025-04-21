import React from 'react';

export default function CodeEditor({ value, onChange }) {
  return (
    <textarea
      className="w-full min-h-[160px] max-h-64 resize-y rounded-xl p-4 font-mono text-base bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border-2 border-zinc-200 dark:border-zinc-700 focus:border-indigo-400 dark:focus:border-indigo-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 code-scrollbar transition placeholder:text-zinc-400/80"
      placeholder="Paste or write your code here..."
      value={value}
      onChange={e => onChange(e.target.value)}
      spellCheck={false}
      autoFocus
    />
  );
}
