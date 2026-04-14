const { knowledgeRepository } = require('../repositories/knowledgeRepository');
const { invokeTool } = require('./mcpClient');

async function faqSkill(message) {
  const knowledge = await knowledgeRepository.findEnabledByCategory('faq');
  const result = await invokeTool('faqLookup', { message, knowledge });
  return result;
}

function leadScoringSkill({ intent, riskLevel, message }) {
  let score = 20;
  if (intent === 'purchase_intent') score += 50;
  if (intent === 'coupon_query') score += 25;
  if (intent === 'product_compare') score += 20;
  if (riskLevel === 'high') score -= 40;
  if (/buy|place order|link|coupon|price/i.test(message)) score += 10;
  return Math.max(0, Math.min(100, score));
}

function complianceSkill(message) {
  if (/(guaranteed cure|100% no side effects|fake order|刷单)/i.test(message)) {
    return { riskLevel: 'high', reason: 'suspicious compliance phrase' };
  }
  if (/(refund|complaint|report)/i.test(message)) {
    return { riskLevel: 'medium', reason: 'customer-service escalation wording' };
  }
  return { riskLevel: 'low', reason: 'normal' };
}

module.exports = { faqSkill, leadScoringSkill, complianceSkill };
