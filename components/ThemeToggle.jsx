import React from 'react';

export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      aria-label="Toggle dark mode"
      className="p-2 rounded-full bg-white/70 dark:bg-zinc-800/80 shadow transition hover:scale-110"
      onClick={() => setDarkMode((v) => !v)}
    >
      {darkMode ? (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fbbf24" d="M21 12.79A9 9 0 0111.21 3a1 1 0 00-1.09 1.37A7 7 0 0019.63 13.88a1 1 0 001.37-1.09z"/></svg>
      ) : (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="#6366f1"/><path stroke="#6366f1" strokeWidth="2" strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      )}
    </button>
  );
}
