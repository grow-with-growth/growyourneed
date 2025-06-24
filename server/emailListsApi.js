// Express.js API for Email List Management (Production Ready)
// Place this file in your backend server directory (e.g., server/emailListsApi.js)

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres', // Change if your username is different
  host: 'localhost',
  database: 'postgres', // Change to your actual database name
  password: '1991',
  port: 5432,
});

// GET /api/email-lists
router.get('/email-lists', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, description, subscriber_count AS "subscriberCount", active_subscribers AS "activeSubscribers", created_at AS "createdAt", updated_at AS "updatedAt", tags, is_active AS "isActive", historical_subscriber_counts AS "historicalSubscriberCounts"
      FROM email_lists
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching email lists:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/email-lists/:id/subscribers
router.get('/email-lists/:id/subscribers', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT id, email, first_name AS "firstName", last_name AS "lastName", status, subscribed_at AS "subscribedAt", unsubscribed_at AS "unsubscribedAt", last_engagement AS "lastEngagement", tags, custom_fields AS "customFields", list_ids AS "listIds", engagement_score AS "engagementScore"
      FROM subscribers
      WHERE $1 = ANY(list_ids)
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching subscribers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

// In your main server.js/app.js:
// const emailListsApi = require('./server/emailListsApi');
// app.use('/api', emailListsApi);
