const request = require('supertest');

jest.mock('../src/config/mysql', () => ({
  pool: {
    query: jest.fn(async (sql) => {
      if (sql.includes('SELECT 1')) return [[{ '1': 1 }]];
      if (sql.includes('COUNT(*) AS total')) return [[{ total: 0 }]];
      if (sql.includes('FROM event_messages')) return [[]];
      if (sql.includes('FROM leads')) return [[]];
      return [[]];
    })
  }
}));

jest.mock('../src/config/redis', () => ({
  redis: {
    ping: jest.fn(async () => 'PONG'),
    incr: jest.fn(async () => 1),
    expire: jest.fn(async () => 1),
    set: jest.fn(async () => 'OK'),
    get: jest.fn(async () => null),
    duplicate: jest.fn(() => ({}))
  }
}));

jest.mock('../src/queues', () => ({
  triageQueue: {
    add: jest.fn(async () => ({ id: 'job-1' }))
  },
  summaryQueue: {},
  connection: {}
}));

const app = require('../src/app');

describe('App basic routes', () => {
  test('GET /health should return ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('POST /api/events/douyin/live-message should accept payload', async () => {
    const res = await request(app)
      .post('/api/events/douyin/live-message')
      .send({
        roomId: 'demo-room-001',
        sessionId: 'session-001',
        userOpenId: 'user-1',
        nickname: 'Alice',
        message: 'Is there a coupon?'
      });

    expect([200, 202]).toContain(res.statusCode);
    expect(res.body.accepted).toBe(true);
  });
});
