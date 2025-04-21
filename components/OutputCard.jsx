import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function OutputCard({ markdown }) {
  return (
    <div className="mt-6 rounded-2xl bg-zinc-900 shadow-lg p-6 border border-zinc-800 transition text-white">
      <div className="max-w-none">
        <ReactMarkdown
          components={{
            h3: ({ node, ...props }) => (
              <h3 className="mt-6 mb-1 text-lg font-semibold text-indigo-400" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-white" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-white" {...props} />
            ),
            code: ({ node, ...props }) => (
              <code className="bg-zinc-800 text-white px-1 rounded" {...props} />
            ),
            pre: ({ node, ...props }) => (
              <pre className="bg-zinc-800 text-white p-2 rounded" {...props} />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
