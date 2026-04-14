function alignAgentOutput({ agentType, draft, intent, riskLevel }) {
  const normalizedDraft = String(draft || '').trim();

  return {
    agentType,
    intent,
    riskLevel,
    tone: 'brand-friendly',
    output: normalizedDraft
      .replace(/!/g, '.')
      .replace(/\s+/g, ' ')
      .slice(0, 500)
  };
}

module.exports = { alignAgentOutput };
