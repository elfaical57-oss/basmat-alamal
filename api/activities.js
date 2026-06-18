const { neon } = require('@neondatabase/serverless');
const jwt = require('jsonwebtoken');

function verifyAuth(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return false;
  try { jwt.verify(token, process.env.JWT_SECRET); return true; } catch { return false; }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = neon(process.env.DATABASE_URL);
  const id = req.query.id;

  try {
    if (req.method === 'GET') {
      const activities = await sql`SELECT * FROM activities ORDER BY created_at ASC`;
      return res.status(200).json(activities);
    }

    if (!verifyAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    const b = req.body || {};

    if (req.method === 'POST') {
      const [a] = await sql`
        INSERT INTO activities (title_ar, title_fr, period_ar, period_fr, description_ar, description_fr, emoji, gradient_from, gradient_to)
        VALUES (${b.title_ar}, ${b.title_fr||b.title_ar}, ${b.period_ar||null}, ${b.period_fr||null},
                ${b.description_ar||null}, ${b.description_fr||null}, ${b.emoji||'🎯'},
                ${b.gradient_from||'#2980b9'}, ${b.gradient_to||'#1a6fa0'})
        RETURNING *`;
      return res.status(201).json(a);
    }

    if (req.method === 'PUT') {
      const [a] = await sql`
        UPDATE activities SET title_ar=${b.title_ar}, title_fr=${b.title_fr||b.title_ar},
          period_ar=${b.period_ar||null}, period_fr=${b.period_fr||null},
          description_ar=${b.description_ar||null}, description_fr=${b.description_fr||null},
          emoji=${b.emoji||'🎯'}, gradient_from=${b.gradient_from||'#2980b9'}, gradient_to=${b.gradient_to||'#1a6fa0'}
        WHERE id=${id} RETURNING *`;
      return res.status(200).json(a);
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM activities WHERE id=${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
