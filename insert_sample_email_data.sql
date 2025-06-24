-- Sample data for email_lists
INSERT INTO email_lists (
  id, name, description, subscriber_count, active_subscribers, created_at, updated_at, tags, is_active, historical_subscriber_counts
) VALUES
  ('list-1', 'All Subscribers', 'Main subscriber list for all users', 5420, 5180, '2024-01-01T00:00:00Z', '2024-01-20T12:00:00Z', ARRAY['main','active'], TRUE, ARRAY[5000,5100,5200,5300,5420]),
  ('list-2', 'Premium Users', 'Subscribers with premium accounts', 890, 856, '2024-01-05T00:00:00Z', '2024-01-20T12:00:00Z', ARRAY['premium','vip'], TRUE, ARRAY[800,850,870,880,890]);

-- Sample data for subscribers
INSERT INTO subscribers (
  id, email, first_name, last_name, status, subscribed_at, unsubscribed_at, last_engagement, tags, custom_fields, list_ids, engagement_score
) VALUES
  ('sub-1', 'user1@example.com', 'User', 'One', 'subscribed', '2024-01-01T00:00:00Z', NULL, '2024-06-01T10:00:00Z', ARRAY['user','active'], '{}', ARRAY['list-1'], 85),
  ('sub-2', 'user2@example.com', 'User', 'Two', 'subscribed', '2024-01-02T00:00:00Z', NULL, '2024-06-02T11:00:00Z', ARRAY['user','active'], '{}', ARRAY['list-1','list-2'], 90),
  ('sub-3', 'vip@example.com', 'VIP', 'Member', 'subscribed', '2024-01-10T00:00:00Z', NULL, '2024-06-03T12:00:00Z', ARRAY['vip','premium'], '{}', ARRAY['list-2'], 95);
