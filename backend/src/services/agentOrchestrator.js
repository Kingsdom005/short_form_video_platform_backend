const { faqSkill, leadScoringSkill, complianceSkill } = require('./skills');
const { alignAgentOutput } = require('./finetuneAlignment');
const { promptTemplates } = require('./promptTemplates');

function inferIntent(message) {
  const text = message.toLowerCase();
  if (/coupon|discount|优惠/i.test(text)) return 'coupon_query';
  if (/how|difference|哪个好|compare|区别/i.test(text)) return 'product_compare';
  if (/buy|link|place order|下单|买吗/i.test(text)) return 'purchase_intent';
  if (/refund|shipping|logistics|售后|发货/i.test(text)) return 'after_sales';
  return 'general_faq';
}

function decideAgent(intent, riskLevel) {
  if (riskLevel === 'high') return 'compliance_agent';
  if (intent === 'after_sales') return 'service_agent';
  if (['purchase_intent', 'coupon_query', 'product_compare'].includes(intent)) return 'sales_agent';
  return 'triage_agent';
}

async function runAgents(payload) {
  const intent = inferIntent(payload.message);
  const { riskLevel, reason } = complianceSkill(payload.message);
  const faq = await faqSkill(payload.message);
  const assignedAgent = decideAgent(intent, riskLevel);
  const leadScore = leadScoringSkill({ intent, riskLevel, message: payload.message });

  let responseText = 'Thanks, your message has been queued for follow-up.';
  if (assignedAgent === 'sales_agent') {
    responseText = faq
      ? `Sales reply: ${faq.content}`
      : 'Sales reply: We have activity benefits in this session. Please check the product card and current coupon area.';
  }
  if (assignedAgent === 'service_agent') {
    responseText = faq
      ? `Service reply: ${faq.content}`
      : 'Service reply: Please provide your order context and we will help confirm shipping or refund details.';
  }
  if (assignedAgent === 'compliance_agent') {
    responseText = 'Compliance review triggered. A manual operator should review this case.';
  }

  const aligned = alignAgentOutput({
    agentType: assignedAgent,
    draft: responseText,
    intent,
    riskLevel
  });

  return {
    promptVersion: 'v1',
    systemPromptUsed:
      assignedAgent === 'sales_agent' ? promptTemplates.salesResponse :
      assignedAgent === 'service_agent' ? promptTemplates.serviceResponse :
      assignedAgent === 'compliance_agent' ? promptTemplates.complianceResponse :
      promptTemplates.triageSystem,
    assignedAgent,
    intent,
    riskLevel,
    riskReason: reason,
    leadScore,
    reply: aligned.output
  };
}

module.exports = { runAgents, inferIntent, decideAgent };
