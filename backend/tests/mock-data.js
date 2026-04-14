const mysql = require('mysql2/promise');
const env = require('../src/config/env');

async function generateMockData() {
  try {
    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: env.mysql.host,
      port: env.mysql.port,
      user: env.mysql.user,
      password: env.mysql.password,
      database: env.mysql.database
    });

    console.log('Connected to MySQL successfully!');

    // Clear existing data
    await connection.query('DELETE FROM events');
    await connection.query('DELETE FROM leads');
    console.log('Cleared existing data');

    // Generate mock leads
    const mockLeads = [
      {
        lead_no: `LD-${Math.random().toString(36).substring(2, 12)}`,
        user_open_id: `user_${Math.random().toString(36).substring(2, 10)}`,
        room_id: 'demo-room-001',
        source_event_id: null,
        lead_status: 'new',
        lead_score: 85,
        intent: '咨询产品',
        assigned_agent: null,
        notes: '潜在客户，对我们的产品很感兴趣'
      },
      {
        lead_no: `LD-${Math.random().toString(36).substring(2, 12)}`,
        user_open_id: `user_${Math.random().toString(36).substring(2, 10)}`,
        room_id: 'demo-room-001',
        source_event_id: null,
        lead_status: 'qualified',
        lead_score: 92,
        intent: '购买',
        assigned_agent: 'agent_001',
        notes: '已经确认购买意向，正在跟进'
      },
      {
        lead_no: `LD-${Math.random().toString(36).substring(2, 12)}`,
        user_open_id: `user_${Math.random().toString(36).substring(2, 10)}`,
        room_id: 'demo-room-001',
        source_event_id: null,
        lead_status: 'closed',
        lead_score: 75,
        intent: '了解',
        assigned_agent: 'agent_002',
        notes: '已结束沟通，暂时没有购买意向'
      }
    ];

    for (const lead of mockLeads) {
      await connection.query(
        `INSERT INTO leads (lead_no, user_open_id, room_id, source_event_id, lead_status, lead_score, intent, assigned_agent, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [lead.lead_no, lead.user_open_id, lead.room_id, lead.source_event_id, lead.lead_status, lead.lead_score, lead.intent, lead.assigned_agent, lead.notes]
      );
    }
    console.log('Generated mock leads');

    // Generate mock events
    const mockEvents = [
      {
        event_id: `EV-${Math.random().toString(36).substring(2, 14)}`,
        idempotency_key: `key_${Math.random().toString(36).substring(2, 20)}`,
        room_id: 'demo-room-001',
        session_id: `session_${Math.random().toString(36).substring(2, 15)}`,
        user_open_id: mockLeads[0].user_open_id,
        nickname: '测试用户1',
        source_type: 'live',
        message: '您好，我想了解一下你们的产品',
        normalized_text: '您好，我想了解一下你们的产品'
      },
      {
        event_id: `EV-${Math.random().toString(36).substring(2, 14)}`,
        idempotency_key: `key_${Math.random().toString(36).substring(2, 20)}`,
        room_id: 'demo-room-001',
        session_id: `session_${Math.random().toString(36).substring(2, 15)}`,
        user_open_id: mockLeads[1].user_open_id,
        nickname: '测试用户2',
        source_type: 'live',
        message: '这个产品怎么收费的？',
        normalized_text: '这个产品怎么收费的？'
      },
      {
        event_id: `EV-${Math.random().toString(36).substring(2, 14)}`,
        idempotency_key: `key_${Math.random().toString(36).substring(2, 20)}`,
        room_id: 'demo-room-001',
        session_id: `session_${Math.random().toString(36).substring(2, 15)}`,
        user_open_id: mockLeads[2].user_open_id,
        nickname: '测试用户3',
        source_type: 'live',
        message: '好的，我考虑一下',
        normalized_text: '好的，我考虑一下'
      },
      {
        event_id: `EV-${Math.random().toString(36).substring(2, 14)}`,
        idempotency_key: `key_${Math.random().toString(36).substring(2, 20)}`,
        room_id: 'demo-room-001',
        session_id: `session_${Math.random().toString(36).substring(2, 15)}`,
        user_open_id: mockLeads[0].user_open_id,
        nickname: '测试用户1',
        source_type: 'live',
        message: '能给我发一份详细的产品资料吗？',
        normalized_text: '能给我发一份详细的产品资料吗？'
      },
      {
        event_id: `EV-${Math.random().toString(36).substring(2, 14)}`,
        idempotency_key: `key_${Math.random().toString(36).substring(2, 20)}`,
        room_id: 'demo-room-001',
        session_id: `session_${Math.random().toString(36).substring(2, 15)}`,
        user_open_id: mockLeads[1].user_open_id,
        nickname: '测试用户2',
        source_type: 'live',
        message: '我想购买这个产品，怎么操作？',
        normalized_text: '我想购买这个产品，怎么操作？'
      }
    ];

    for (const event of mockEvents) {
      await connection.query(
        `INSERT INTO events (event_id, idempotency_key, room_id, session_id, user_open_id, nickname, source_type, message, normalized_text) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [event.event_id, event.idempotency_key, event.room_id, event.session_id, event.user_open_id, event.nickname, event.source_type, event.message, event.normalized_text]
      );
    }
    console.log('Generated mock events');

    // Close connection
    await connection.end();
    console.log('Mock data generated successfully!');
  } catch (error) {
    console.error('Error generating mock data:', error.message);
  }
}

generateMockData();
