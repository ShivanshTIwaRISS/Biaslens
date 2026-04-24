import { useEffect, useRef, useState } from 'react';

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const getRiskColor = (riskLevel, biasScore) => {
  if (riskLevel === 'High' || biasScore > 60) return '#ef4444';
  if (riskLevel === 'Medium' || biasScore > 20) return '#f59e0b';
  return '#10b981';
};

export default function ScoreCircle({ biasScore = 0, riskLevel = 'Low', confidence = 0 }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [displayConf, setDisplayConf] = useState(0);
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  const fairnessScore = Math.max(0, 100 - biasScore);
  const color = getRiskColor(riskLevel, biasScore);

  // Stroke offset: 0 = full circle, CIRCUMFERENCE = empty
  const offset = CIRCUMFERENCE - (fairnessScore / 100) * CIRCUMFERENCE;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!animated) return;
    let frame;
    let start = null;
    const duration = 1200;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * biasScore));
      setDisplayConf(Math.round(eased * confidence));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [animated, biasScore, confidence]);

  const riskLabel = riskLevel === 'High' ? '🔴 High Risk' : riskLevel === 'Medium' ? '🟡 Medium Risk' : '🟢 Low Risk';

  return (
    <div className="score-card" ref={ref}>
      <div className="score-circle-container">
        <svg className="score-circle-svg" viewBox="0 0 100 100">
          <circle className="score-circle-bg" cx="50" cy="50" r={RADIUS} />
          <circle
            className="score-circle-progress"
            cx="50" cy="50" r={RADIUS}
            stroke={color}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={animated ? offset : CIRCUMFERENCE}
            style={{ transition: animated ? 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' : 'none' }}
          />
        </svg>
        <div className="score-circle-text">
          <span className="score-number" style={{ color }}>{displayScore}</span>
          <span className="score-label">Bias Score</span>
        </div>
      </div>

      <div className="score-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>Audit Complete</h2>
          <span className={`risk-badge ${riskLevel.toLowerCase()}`}>{riskLabel}</span>
        </div>
        <p>
          {riskLevel === 'High'
            ? 'Significant bias detected. This content contains language that may lead to discriminatory outcomes.'
            : riskLevel === 'Medium'
            ? 'Moderate bias detected. Some language could be interpreted as unfair or exclusionary.'
            : 'Minimal bias detected. This content appears largely fair and inclusive.'}
        </p>
        <div className="confidence-bar-wrap">
          <span className="confidence-label">AI Confidence</span>
          <div className="confidence-bar">
            <div className="confidence-bar-fill" style={{ width: animated ? `${confidence}%` : '0%' }} />
          </div>
          <span className="confidence-value">{displayConf}%</span>
        </div>
      </div>
    </div>
  );
}
