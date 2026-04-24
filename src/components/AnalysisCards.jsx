import { useState } from 'react';

export default function AnalysisCards({ analysis = [] }) {
  if (!analysis.length) return null;

  return (
    <div className="analysis-section">
      <h3 className="analysis-section-title">⚠️ Bias Findings ({analysis.length})</h3>
      {analysis.map((item, idx) => (
        <AnalysisCard key={idx} item={item} index={idx} />
      ))}
    </div>
  );
}

function AnalysisCard({ item, index }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className="analysis-card"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="analysis-card-header" style={{ cursor: 'pointer', userSelect: 'none' }}>
        <span className="analysis-bias-type">{item.biasType}</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
          {expanded ? '▲ Collapse' : '▼ Expand'}
        </span>
      </div>

      {expanded && (
        <div className="analysis-grid">
          <div className="analysis-block">
            <div className="analysis-block-label">
              <span>🔍</span> Problematic Quote
            </div>
            <div className="analysis-block-text analysis-quote">
              "{item.quote}"
            </div>
          </div>

          <div className="analysis-block">
            <div className="analysis-block-label">
              <span>💡</span> Suggested Fix
            </div>
            <div className="analysis-block-text analysis-fix">
              {item.fixSuggestion}
            </div>
          </div>

          <div className="analysis-block analysis-explanation">
            <div className="analysis-block-label">
              <span>📖</span> Why This Is Unfair
            </div>
            <div className="analysis-block-text">
              {item.explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
