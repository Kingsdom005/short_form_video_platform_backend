USE douyin_agent;

INSERT INTO rooms (room_id, room_name, owner_name, status)
VALUES ('demo-room-001', 'Demo Douyin Live Room', 'Streamer A', 'online')
ON DUPLICATE KEY UPDATE room_name=VALUES(room_name);

INSERT INTO live_sessions (session_id, room_id, title, started_at, status)
VALUES ('session-001', 'demo-room-001', 'Spring Promotion Live Session', NOW(), 'running')
ON DUPLICATE KEY UPDATE title=VALUES(title);

INSERT INTO knowledge_items (item_key, category, title, content, enabled)
VALUES
('faq_coupon', 'faq', 'Coupon Policy', 'Today coupon policy: new users can receive a limited discount coupon during live session.', 1),
('faq_shipping', 'faq', 'Shipping Policy', 'Orders confirmed before 16:00 may be shipped on the same day depending on warehouse stock.', 1),
('faq_refund', 'faq', 'Refund Policy', 'Refund requests should enter manual review if the order status is exceptional.', 1)
ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), enabled=VALUES(enabled);
