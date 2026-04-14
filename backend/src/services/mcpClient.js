async function invokeTool(toolName, payload) {
  const tools = {
    faqLookup: async ({ message, knowledge }) => {
      const match = knowledge.find(item => {
        const content = `${item.title} ${item.content}`.toLowerCase();
        return message.toLowerCase().split(/\s+/).some(token => content.includes(token));
      });
      return match || null;
    },
    sentimentLite: async ({ message }) => {
      const risky = /(fake|refund now|complaint|angry|report)/i.test(message);
      return { sentiment: risky ? 'negative' : 'neutral' };
    }
  };

  const tool = tools[toolName];
  if (!tool) {
    throw new Error(`Tool not found: ${toolName}`);
  }
  return tool(payload);
}

module.exports = { invokeTool };
