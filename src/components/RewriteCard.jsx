import { useState } from 'react';

export default function RewriteCard({ rewrittenText = '', title = '✅ Fairer Rewritten Version', isRemediation = false }) {
  const [copied, setCopied] = useState(false);

  if (!rewrittenText) return null;

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(rewrittenText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = rewrittenText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rewrite-card">
      <div className="rewrite-card-header">
        <div className="rewrite-card-title">
          <span>{title}</span>
        </div>
        <button
          id="copy-rewrite-btn"
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? '✓ Copied!' : '📋 Copy Text'}
        </button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
        {isRemediation
          ? 'Actionable steps to address the identified biases and improve fairness.'
          : 'This version removes identified biases while preserving the original intent. Ready to use.'}
      </p>
      <div className="rewrite-text">{rewrittenText}</div>
    </div>
  );
}
