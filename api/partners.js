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
      const partners = await sql`SELECT * FROM partners ORDER BY created_at ASC`;
      return res.status(200).json(partners);
    }

    if (!verifyAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    const b = req.body || {};

    if (req.method === 'POST') {
      const [p] = await sql`
        INSERT INTO partners (name_ar, name_fr, logo_url, emoji, website_url)
        VALUES (${b.name_ar}, ${b.name_fr||b.name_ar}, ${b.logo_url||null}, ${b.emoji||'🤝'}, ${b.website_url||null})
        RETURNING *`;
      return res.status(201).json(p);
    }

    if (req.method === 'PUT') {
      const [p] = await sql`
        UPDATE partners SET name_ar=${b.name_ar}, name_fr=${b.name_fr||b.name_ar},
          logo_url=${b.logo_url||null}, emoji=${b.emoji||'🤝'}, website_url=${b.website_url||null}
        WHERE id=${id} RETURNING *`;
      return res.status(200).json(p);
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM partners WHERE id=${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
